<?php
namespace App\Order;

use App\Shared\Http\Request;
use App\Shared\Http\Response;
use App\Shared\Middleware\AuthMiddleware;

class OrderController {
    public function index(): void {
        $user = AuthMiddleware::requireAuth();
        Response::success([], 'Lấy danh sách đơn hàng thành công');
    }

    public function show(string $id): void {
        $user = AuthMiddleware::requireAuth();
        Response::success(['id' => $id], 'Lấy chi tiết đơn hàng thành công');
    }

    public function create(): void {
        $user = AuthMiddleware::requireAuth();
        $data = Request::getBody();
        
        // TODO: Thực thi DB Transaction (Tạo order, insert order_items, trừ stock, clear cart)
        Response::success([
            'order_id' => 5002,
            'order_code' => 'ORD-' . date('Ymd') . '-5002',
            'final_amount' => 308000.00,
            'status' => 'CONFIRMED'
        ], 'Đặt hàng thành công', [], 201);
    }
}
