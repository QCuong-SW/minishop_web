<?php
namespace App\Cart;

use App\Shared\Http\Request;
use App\Shared\Http\Response;
use App\Shared\Middleware\AuthMiddleware;

class CartController {
    private CartRepository $repo;

    public function __construct() {
        $this->repo = new CartRepository();
    }

    public function getCart(): void {
        $user = AuthMiddleware::requireAuth();
        $cart = $this->repo->getCartByUserId($user['id']);
        Response::success($cart, 'Lấy giỏ hàng thành công');
    }

    public function addItem(): void {
        $user = AuthMiddleware::requireAuth();
        $data = Request::getBody();
        if (empty($data['product_id'])) {
            Response::error('Thiếu thông tin sản phẩm', [], 400);
        }

        try {
            $cart = $this->repo->addItem($user['id'], (int)$data['product_id'], (int)($data['quantity'] ?? 1));
            Response::success($cart, 'Đã thêm sản phẩm vào giỏ hàng', [], 201);
        } catch (\Exception $e) {
            Response::error($e->getMessage(), [], 400);
        }
    }

    public function updateItem(string $id): void {
        $user = AuthMiddleware::requireAuth();
        $data = Request::getBody();
        $quantity = (int)($data['quantity'] ?? 1);

        try {
            $cart = $this->repo->updateItem($user['id'], (int)$id, $quantity);
            Response::success($cart, 'Cập nhật giỏ hàng thành công');
        } catch (\Exception $e) {
            Response::error($e->getMessage(), [], 400);
        }
    }

    public function removeItem(string $id): void {
        $user = AuthMiddleware::requireAuth();
        $cart = $this->repo->removeItem($user['id'], (int)$id);
        Response::success($cart, 'Đã xóa sản phẩm khỏi giỏ hàng');
    }
}
