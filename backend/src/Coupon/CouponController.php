<?php
namespace App\Coupon;

use App\Shared\Http\Request;
use App\Shared\Http\Response;
use App\Shared\Middleware\AuthMiddleware;
use App\Shared\Database\Database;
use PDO;

class CouponController {
    public function index(): void {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT * FROM coupons ORDER BY id DESC");
        Response::success($stmt->fetchAll(), 'Lấy danh sách mã giảm giá thành công');
    }

    public function validate(): void {
        $data = Request::getBody();
        $code = strtoupper(trim($data['code'] ?? ''));
        $orderAmount = (float)($data['order_amount'] ?? 0);

        if (empty($code)) {
            Response::error('Vui lòng nhập mã giảm giá', [], 400);
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM coupons WHERE code = :code AND status = 'ACTIVE' LIMIT 1");
        $stmt->execute([':code' => $code]);
        $coupon = $stmt->fetch();

        if (!$coupon) {
            Response::error('Mã giảm giá không tồn tại hoặc đã hết hạn!', [], 400);
        }

        if ($orderAmount < (float)$coupon['min_order_amount']) {
            Response::error('Đơn hàng tối thiểu phải từ ' . number_format($coupon['min_order_amount'], 0, ',', '.') . ' đ để áp dụng mã này!', [], 400);
        }

        if ((int)$coupon['used_count'] >= (int)$coupon['usage_limit']) {
            Response::error('Mã giảm giá đã hết lượt sử dụng!', [], 400);
        }

        $discount = 0.0;
        if ($coupon['discount_type'] === 'FIXED') {
            $discount = (float)$coupon['discount_value'];
        } else {
            $discount = ($orderAmount * (float)$coupon['discount_value']) / 100;
            if (!empty($coupon['max_discount']) && $discount > (float)$coupon['max_discount']) {
                $discount = (float)$coupon['max_discount'];
            }
        }

        Response::success([
            'coupon_id' => (int)$coupon['id'],
            'code' => $coupon['code'],
            'discount_amount' => $discount,
            'description' => $coupon['description']
        ], "Áp dụng mã {$coupon['code']} thành công! Giảm " . number_format($discount, 0, ',', '.') . ' đ.');
    }

    public function store(): void {
        AuthMiddleware::requireAdmin();
        $data = Request::getBody();
        $code = strtoupper(trim($data['code'] ?? ''));
        if (empty($code) || empty($data['discount_value'])) {
            Response::error('Vui lòng nhập mã code và giá trị giảm', [], 400);
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount, expires_at, usage_limit, used_count, status) VALUES (:code, :description, :type, :value, :min_order, :max_discount, :expires_at, :limit, 0, 'ACTIVE')");
        $stmt->execute([
            ':code' => $code,
            ':description' => $data['description'] ?? '',
            ':type' => $data['discount_type'] ?? 'FIXED',
            ':value' => (float)$data['discount_value'],
            ':min_order' => (float)($data['min_order_amount'] ?? 0),
            ':max_discount' => !empty($data['max_discount']) ? (float)$data['max_discount'] : null,
            ':expires_at' => $data['expires_at'] ?? '2026-12-31 23:59:59',
            ':limit' => (int)($data['usage_limit'] ?? 100),
        ]);

        Response::success(['id' => $db->lastInsertId(), 'code' => $code], 'Tạo mã giảm giá thành công', [], 201);
    }
}
