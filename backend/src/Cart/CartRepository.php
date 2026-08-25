<?php
namespace App\Cart;

use App\Shared\Database\Database;
use PDO;

class CartRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getCartByUserId(int $userId): array {
        $query = "SELECT c.id, c.product_id, c.quantity, p.name, p.slug, p.price, p.original_price, p.image_url, p.stock, (c.quantity * p.price) AS subtotal 
                  FROM cart_items c 
                  JOIN products p ON c.product_id = p.id 
                  WHERE c.user_id = :user_id AND p.status = 'ACTIVE' 
                  ORDER BY c.id DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute([':user_id' => $userId]);
        $items = $stmt->fetchAll();

        $totalQuantity = 0;
        $totalAmount = 0.0;

        foreach ($items as &$item) {
            $item['price'] = (float)$item['price'];
            $item['original_price'] = $item['original_price'] ? (float)$item['original_price'] : (float)$item['price'];
            $item['subtotal'] = (float)$item['subtotal'];
            $item['stock'] = (int)$item['stock'];
            $item['selected'] = true;

            $totalQuantity += (int)$item['quantity'];
            $totalAmount += $item['subtotal'];
        }

        return [
            'items' => $items,
            'total_quantity' => $totalQuantity,
            'total_amount' => $totalAmount
        ];
    }

    public function addItem(int $userId, int $productId, int $quantity = 1): array {
        // Check product stock
        $stmt = $this->db->prepare("SELECT id, name, stock, price FROM products WHERE id = :id AND status = 'ACTIVE' LIMIT 1");
        $stmt->execute([':id' => $productId]);
        $product = $stmt->fetch();
        if (!$product) throw new \Exception("Sản phẩm không tồn tại");

        // Check if existing in cart
        $checkStmt = $this->db->prepare("SELECT id, quantity FROM cart_items WHERE user_id = :uid AND product_id = :pid LIMIT 1");
        $checkStmt->execute([':uid' => $userId, ':pid' => $productId]);
        $existing = $checkStmt->fetch();

        if ($existing) {
            $newQty = (int)$existing['quantity'] + $quantity;
            if ($newQty > (int)$product['stock']) {
                throw new \Exception("Kho chỉ còn " . $product['stock'] . " sản phẩm");
            }
            $upStmt = $this->db->prepare("UPDATE cart_items SET quantity = :qty WHERE id = :id");
            $upStmt->execute([':qty' => $newQty, ':id' => $existing['id']]);
        } else {
            if ($quantity > (int)$product['stock']) {
                throw new \Exception("Kho chỉ còn " . $product['stock'] . " sản phẩm");
            }
            $insStmt = $this->db->prepare("INSERT INTO cart_items (user_id, product_id, quantity) VALUES (:uid, :pid, :qty)");
            $insStmt->execute([':uid' => $userId, ':pid' => $productId, ':qty' => $quantity]);
        }

        return $this->getCartByUserId($userId);
    }

    public function updateItem(int $userId, int $productIdOrCartId, int $quantity): array {
        if ($quantity <= 0) {
            return $this->removeItem($userId, $productIdOrCartId);
        }

        $stmt = $this->db->prepare("UPDATE cart_items SET quantity = :qty WHERE user_id = :uid AND (id = :cid OR product_id = :pid)");
        $stmt->execute([':qty' => $quantity, ':uid' => $userId, ':cid' => $productIdOrCartId, ':pid' => $productIdOrCartId]);

        return $this->getCartByUserId($userId);
    }

    public function removeItem(int $userId, int $productIdOrCartId): array {
        $stmt = $this->db->prepare("DELETE FROM cart_items WHERE user_id = :uid AND (id = :cid OR product_id = :pid)");
        $stmt->execute([':uid' => $userId, ':cid' => $productIdOrCartId, ':pid' => $productIdOrCartId]);

        return $this->getCartByUserId($userId);
    }
}
