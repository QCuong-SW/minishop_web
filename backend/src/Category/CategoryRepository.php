<?php
namespace App\Category;

use App\Shared\Database\Database;
use PDO;

class CategoryRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function findAll(): array {
        $query = "SELECT c.*, COUNT(p.id) AS product_count 
                  FROM categories c 
                  LEFT JOIN products p ON c.id = p.category_id AND p.status = 'ACTIVE'
                  WHERE c.status = 'ACTIVE'
                  GROUP BY c.id 
                  ORDER BY c.id ASC";
        $stmt = $this->db->query($query);
        $categories = $stmt->fetchAll();
        foreach ($categories as &$cat) {
            $cat['product_count'] = (int)$cat['product_count'];
        }
        return $categories;
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM categories WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch() ?: null;
    }

    public function create(array $data): array {
        $slug = !empty($data['slug']) ? $data['slug'] : preg_replace('/[^a-z0-9]+/i', '-', strtolower($data['name']));
        $stmt = $this->db->prepare("INSERT INTO categories (name, slug, description, image_url, status) VALUES (:name, :slug, :description, :image_url, 'ACTIVE')");
        $stmt->execute([
            ':name' => $data['name'],
            ':slug' => trim($slug, '-'),
            ':description' => $data['description'] ?? '',
            ':image_url' => $data['image_url'] ?? 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
        ]);
        return $this->findById((int)$this->db->lastInsertId());
    }

    public function update(int $id, array $data): ?array {
        $cat = $this->findById($id);
        if (!$cat) return null;

        $name = $data['name'] ?? $cat['name'];
        $slug = !empty($data['slug']) ? $data['slug'] : preg_replace('/[^a-z0-9]+/i', '-', strtolower($name));
        $desc = $data['description'] ?? $cat['description'];
        $image = $data['image_url'] ?? $cat['image_url'];
        $status = $data['status'] ?? $cat['status'];

        $stmt = $this->db->prepare("UPDATE categories SET name = :name, slug = :slug, description = :description, image_url = :image_url, status = :status WHERE id = :id");
        $stmt->execute([
            ':name' => $name,
            ':slug' => trim($slug, '-'),
            ':description' => $desc,
            ':image_url' => $image,
            ':status' => $status,
            ':id' => $id
        ]);
        return $this->findById($id);
    }

    public function delete(int $id): bool {
        // Check if has products
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM products WHERE category_id = :id");
        $stmt->execute([':id' => $id]);
        if ((int)$stmt->fetchColumn() > 0) {
            throw new \Exception("Không thể xóa danh mục đang có sản phẩm!");
        }

        $stmt = $this->db->prepare("DELETE FROM categories WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
}
