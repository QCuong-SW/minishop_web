<?php
namespace App\Cart;

use App\Shared\Http\Request;
use App\Shared\Http\Response;
use App\Shared\Middleware\AuthMiddleware;

class CartController {
    public function getCart(): void {
        $user = AuthMiddleware::requireAuth();
        // TODO: Lấy danh sách cart_items theo user_id
        Response::success([
            'items' => [],
            'total_quantity' => 0,
            'total_amount' => 0.00
        ], 'Lấy giỏ hàng thành công');
    }

    public function addItem(): void {
        $user = AuthMiddleware::requireAuth();
        $data = Request::getBody();
        Response::success($data, 'Thêm vào giỏ hàng thành công', [], 201);
    }

    public function updateItem(string $id): void {
        $user = AuthMiddleware::requireAuth();
        $data = Request::getBody();
        Response::success($data, 'Cập nhật giỏ hàng thành công');
    }

    public function removeItem(string $id): void {
        $user = AuthMiddleware::requireAuth();
        Response::success(null, 'Xóa sản phẩm khỏi giỏ thành công');
    }
}
