<?php
namespace App\Review;
use App\Shared\Http\Request;
use App\Shared\Http\Response;
use App\Shared\Middleware\AuthMiddleware;

class ReviewController {
    public function getByProduct(string $productId): void {
        Response::success([], 'Lấy đánh giá sản phẩm thành công');
    }

    public function store(): void {
        $user = AuthMiddleware::requireAuth();
        $data = Request::getBody();
        Response::success($data, 'Đánh giá sản phẩm thành công', [], 201);
    }
}
