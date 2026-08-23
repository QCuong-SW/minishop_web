<?php
namespace App\Product;

use App\Shared\Database\Database;
use PDO;

class ProductRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function findAll(array $params): array {
        $page = max(1, (int)($params['page'] ?? 1));
        $limit = max(1, min(50, (int)($params['limit'] ?? 12)));
        $offset = ($page - 1) * $limit;

        $query = "SELECT p.*, c.name AS category_name 
                  FROM products p 
                  JOIN categories c ON p.category_id = c.id 
                  WHERE p.status = 'ACTIVE'";
        
        $countStmt = $this->db->query("SELECT COUNT(*) FROM products WHERE status = 'ACTIVE'");
        $total = (int)$countStmt->fetchColumn();

        $query .= " ORDER BY p.id DESC LIMIT :limit OFFSET :offset";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll();

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

    public function findBySlug(string $slug): ?array {
        $stmt = $this->db->prepare("SELECT p.*, c.name AS category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.slug = :slug LIMIT 1");
        $stmt->execute([':slug' => $slug]);
        $product = $stmt->fetch();
        return $product ?: null;
    }

    public function create(array $data): array {
        // TODO: Viết SQL insert sản phẩm mới
        return $data;
    }
}
