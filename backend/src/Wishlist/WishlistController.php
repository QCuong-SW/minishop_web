<?php
namespace App\Wishlist;

use App\Shared\Http\Response;
use App\Shared\Middleware\AuthMiddleware;
use App\Shared\Database\Database;

class WishlistController {
    public function index(): void {
        $user = AuthMiddleware::requireAuth();
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT product_id FROM wishlists WHERE user_id = :uid");
        $stmt->execute([':uid' => $user['id']]);
        $rows = $stmt->fetchAll();
        $productIds = array_map(fn($r) => (int)$r['product_id'], $rows);
        Response::success($productIds, 'Lấy danh sách yêu thích thành công');
    }

    public function toggle(string $productId): void {
        $user = AuthMiddleware::requireAuth();
        $pid = (int)$productId;
        $db = Database::getConnection();

        $check = $db->prepare("SELECT id FROM wishlists WHERE user_id = :uid AND product_id = :pid LIMIT 1");
        $check->execute([':uid' => $user['id'], ':pid' => $pid]);
        $existing = $check->fetch();

        if ($existing) {
            $del = $db->prepare("DELETE FROM wishlists WHERE id = :id");
            $del->execute([':id' => $existing['id']]);
            $isWishlisted = false;
        } else {
            $ins = $db->prepare("INSERT INTO wishlists (user_id, product_id) VALUES (:uid, :pid)");
            $ins->execute([':uid' => $user['id'], ':pid' => $pid]);
            $isWishlisted = true;
        }

        Response::success(['is_wishlisted' => $isWishlisted, 'product_id' => $pid], 'Cập nhật yêu thích thành công');
    }
}
