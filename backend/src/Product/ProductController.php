<?php
namespace App\Product;

use App\Shared\Http\Request;
use App\Shared\Http\Response;

class ProductController {
    private ProductService $service;

    public function __construct() {
        $this->service = new ProductService();
    }

    public function index(): void {
        $params = Request::getQueryParams();
        $result = $this->service->getProducts($params);
        Response::success($result['items'], 'Lấy danh sách sản phẩm thành công', $result['meta']);
    }

    public function show(string $slug): void {
        $product = $this->service->getProductBySlug($slug);
        if (!$product) {
            Response::error('Không tìm thấy sản phẩm', [], 404);
        }
        Response::success($product, 'Lấy chi tiết sản phẩm thành công');
    }

    public function store(): void {
        $data = Request::getBody();
        $created = $this->service->createProduct($data);
        Response::success($created, 'Tạo sản phẩm thành công', [], 201);
    }
}
