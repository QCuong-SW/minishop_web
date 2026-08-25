<?php
namespace App\Product;

use App\Shared\Database\Database;
use PDO;

class ProductRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function findAll(array $params = []): array {
        $page = max(1, (int)($params['page'] ?? 1));
        $limit = max(1, min(100, (int)($params['limit'] ?? 50)));
        $offset = ($page - 1) * $limit;

        $where = ["p.status = 'ACTIVE'"];
        $bindings = [];

        if (!empty($params['category_id'])) {
            $where[] = "p.category_id = :category_id";
            $bindings[':category_id'] = (int)$params['category_id'];
        }

        if (!empty($params['keyword'])) {
            $kw = '%' . trim($params['keyword']) . '%';
            $where[] = "(p.name LIKE :kw1 OR p.description LIKE :kw2 OR c.name LIKE :kw3)";
            $bindings[':kw1'] = $kw;
            $bindings[':kw2'] = $kw;
            $bindings[':kw3'] = $kw;
        }

        if (isset($params['min_price']) && is_numeric($params['min_price'])) {
            $where[] = "p.price >= :min_price";
            $bindings[':min_price'] = (float)$params['min_price'];
        }

        if (isset($params['max_price']) && is_numeric($params['max_price'])) {
            $where[] = "p.price <= :max_price";
            $bindings[':max_price'] = (float)$params['max_price'];
        }

        if (isset($params['rating']) && is_numeric($params['rating'])) {
            $where[] = "p.rating_avg >= :rating";
            $bindings[':rating'] = (float)$params['rating'];
        }

        $whereSql = implode(' AND ', $where);

        // Sorting
        $orderBy = "p.id DESC";
        if (!empty($params['sort'])) {
            switch ($params['sort']) {
                case 'price_asc':
                    $orderBy = "p.price ASC";
                    break;
                case 'price_desc':
                    $orderBy = "p.price DESC";
                    break;
                case 'rating_desc':
                    $orderBy = "p.rating_avg DESC";
                    break;
                case 'sold_desc':
                    $orderBy = "p.rating_count DESC, p.id DESC";
                    break;
                case 'newest':
                default:
                    $orderBy = "p.id DESC";
                    break;
            }
        }

        // Count total
        $countQuery = "SELECT COUNT(*) FROM products p JOIN categories c ON p.category_id = c.id WHERE {$whereSql}";
        $countStmt = $this->db->prepare($countQuery);
        $countStmt->execute($bindings);
        $total = (int)$countStmt->fetchColumn();

        // Query data
        $query = "SELECT p.*, c.name AS category_name, c.slug AS category_slug 
                  FROM products p 
                  JOIN categories c ON p.category_id = c.id 
                  WHERE {$whereSql} 
                  ORDER BY {$orderBy} 
                  LIMIT :limit OFFSET :offset";

        $stmt = $this->db->prepare($query);
        foreach ($bindings as $key => $val) {
            $stmt->bindValue($key, $val);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll();

        foreach ($items as &$item) {
            $item['price'] = (float)$item['price'];
            $item['original_price'] = $item['original_price'] ? (float)$item['original_price'] : (float)$item['price'];
            $item['stock'] = (int)$item['stock'];
            $item['rating_avg'] = (float)$item['rating_avg'];
            $item['rating_count'] = (int)$item['rating_count'];
            $item['images'] = [$item['image_url']];
        }

        return [
            'items' => $items,
            'meta' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'total_pages' => ceil($total / $limit)
            ]
        ];
    }

    public function findBySlugOrId(string $identifier): ?array {
        $stmt = $this->db->prepare("SELECT p.*, c.name AS category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.slug = :slug OR p.id = :id LIMIT 1");
        $stmt->execute([':slug' => $identifier, ':id' => is_numeric($identifier) ? (int)$identifier : 0]);
        $product = $stmt->fetch();
        if (!$product) return null;

        $product['price'] = (float)$product['price'];
        $product['original_price'] = $product['original_price'] ? (float)$product['original_price'] : (float)$product['price'];
        $product['stock'] = (int)$product['stock'];
        $product['rating_avg'] = (float)$product['rating_avg'];
        $product['rating_count'] = (int)$product['rating_count'];
        $product['images'] = [$product['image_url']];

        // Fetch reviews
        $revStmt = $this->db->prepare("SELECT r.*, u.name AS user_name, u.avatar_url AS user_avatar FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = :pid ORDER BY r.id DESC");
        $revStmt->execute([':pid' => $product['id']]);
        $product['reviews'] = $revStmt->fetchAll();

        return $product;
    }

    public function create(array $data): array {
        $slug = !empty($data['slug']) ? $data['slug'] : preg_replace('/[^a-z0-9]+/i', '-', strtolower($data['name']));
        $stmt = $this->db->prepare("INSERT INTO products (category_id, name, slug, description, price, original_price, stock, image_url, rating_avg, rating_count, status) VALUES (:category_id, :name, :slug, :description, :price, :original_price, :stock, :image_url, 5.00, 0, 'ACTIVE')");
        $stmt->execute([
            ':category_id' => (int)$data['category_id'],
            ':name' => $data['name'],
            ':slug' => trim($slug, '-') . '-' . time(),
            ':description' => $data['description'] ?? '',
            ':price' => (float)$data['price'],
            ':original_price' => !empty($data['original_price']) ? (float)$data['original_price'] : (float)$data['price'],
            ':stock' => (int)($data['stock'] ?? 50),
            ':image_url' => $data['image_url'] ?? 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600',
        ]);
        return $this->findBySlugOrId((string)$this->db->lastInsertId());
    }

    public function update(int $id, array $data): ?array {
        $product = $this->findBySlugOrId((string)$id);
        if (!$product) return null;

        $name = $data['name'] ?? $product['name'];
        $price = isset($data['price']) ? (float)$data['price'] : (float)$product['price'];
        $origPrice = isset($data['original_price']) ? (float)$data['original_price'] : (float)$product['original_price'];
        $stock = isset($data['stock']) ? (int)$data['stock'] : (int)$product['stock'];
        $catId = isset($data['category_id']) ? (int)$data['category_id'] : (int)$product['category_id'];
        $desc = $data['description'] ?? $product['description'];
        $image = $data['image_url'] ?? $product['image_url'];
        $status = $data['status'] ?? $product['status'];

        $stmt = $this->db->prepare("UPDATE products SET category_id = :cat_id, name = :name, description = :desc, price = :price, original_price = :orig_price, stock = :stock, image_url = :image, status = :status WHERE id = :id");
        $stmt->execute([
            ':cat_id' => $catId,
            ':name' => $name,
            ':desc' => $desc,
            ':price' => $price,
            ':orig_price' => $origPrice,
            ':stock' => $stock,
            ':image' => $image,
            ':status' => $status,
            ':id' => $id
        ]);

        return $this->findBySlugOrId((string)$id);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("UPDATE products SET status = 'INACTIVE' WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
}
