<?php
namespace App\Review;

use App\Shared\Http\Request;
use App\Shared\Http\Response;
use App\Shared\Middleware\AuthMiddleware;
use App\Shared\Database\Database;

class ReviewController {
    public function getByProduct(string $productId): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT r.*, u.name AS user_name, u.avatar_url AS user_avatar FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = :pid ORDER BY r.id DESC");
        $stmt->execute([':pid' => (int)$productId]);
        Response::success($stmt->fetchAll(), 'Lấy đánh giá thành công');
    }

    public function store(): void {
        $user = AuthMiddleware::requireAuth();
        $data = Request::getBody();
        if (empty($data['product_id']) || empty($data['rating'])) {
            Response::error('Vui lòng chọn sản phẩm và số sao đánh giá', [], 400);
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("INSERT INTO reviews (user_id, product_id, order_id, rating, comment) VALUES (:uid, :pid, :oid, :rating, :comment)");
        $stmt->execute([
            ':uid' => $user['id'],
            ':pid' => (int)$data['product_id'],
            ':oid' => !empty($data['order_id']) ? (int)$data['order_id'] : null,
            ':rating' => min(5, max(1, (int)$data['rating'])),
            ':comment' => $data['comment'] ?? ''
        ]);

        // Recalculate product rating
        $calcStmt = $db->prepare("SELECT AVG(rating) AS avg_rating, COUNT(*) AS count_rating FROM reviews WHERE product_id = :pid");
        $calcStmt->execute([':pid' => (int)$data['product_id']]);
        $stat = $calcStmt->fetch();

        $upStmt = $db->prepare("UPDATE products SET rating_avg = :avg, rating_count = :count WHERE id = :pid");
        $upStmt->execute([
            ':avg' => round((float)$stat['avg_rating'], 2),
            ':count' => (int)$stat['count_rating'],
            ':pid' => (int)$data['product_id']
        ]);

        Response::success(['id' => $db->lastInsertId()], 'Gửi đánh giá thành công!', [], 201);
    }
}
