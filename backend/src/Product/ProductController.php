<?php
namespace App\Product;

use App\Shared\Http\Request;
use App\Shared\Http\Response;
use App\Shared\Middleware\AuthMiddleware;

class ProductController {
    private ProductRepository $repo;

    public function __construct() {
        $this->repo = new ProductRepository();
    }

    public function index(): void {
        $params = Request::getQueryParams();
        $result = $this->repo->findAll($params);
        Response::success($result['items'], 'Lấy danh sách sản phẩm thành công', $result['meta']);
    }

    public function show(string $slug): void {
        $product = $this->repo->findBySlugOrId($slug);
        if (!$product) {
            Response::error('Không tìm thấy sản phẩm', [], 404);
        }
        Response::success($product, 'Lấy chi tiết sản phẩm thành công');
    }

    public function store(): void {
        AuthMiddleware::requireAdmin();
        $data = Request::getBody();
        if (empty($data['name']) || empty($data['price']) || empty($data['category_id'])) {
            Response::error('Vui lòng điền tên, giá và danh mục sản phẩm', [], 400);
        }

        $product = $this->repo->create($data);
        Response::success($product, 'Tạo sản phẩm thành công', [], 201);
    }

    public function update(string $id): void {
        AuthMiddleware::requireAdmin();
        $data = Request::getBody();
        $product = $this->repo->update((int)$id, $data);
        if (!$product) {
            Response::error('Không tìm thấy sản phẩm', [], 404);
        }
        Response::success($product, 'Cập nhật sản phẩm thành công');
    }

    public function delete(string $id): void {
        AuthMiddleware::requireAdmin();
        $deleted = $this->repo->delete((int)$id);
        if (!$deleted) {
            Response::error('Không tìm thấy sản phẩm', [], 404);
        }
        Response::success(null, 'Xóa sản phẩm thành công');
    }
}
