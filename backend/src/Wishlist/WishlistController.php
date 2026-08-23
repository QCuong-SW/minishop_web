<?php
namespace App\Wishlist;
use App\Shared\Http\Response;
use App\Shared\Middleware\AuthMiddleware;

class WishlistController {
    public function index(): void {
        $user = AuthMiddleware::requireAuth();
        Response::success([], 'Lấy danh sách yêu thích thành công');
    }

    public function toggle(string $productId): void {
        $user = AuthMiddleware::requireAuth();
        Response::success(['product_id' => $productId], 'Cập nhật yêu thích thành công');
    }
}
