<?php
namespace App\Category;

use App\Shared\Http\Request;
use App\Shared\Http\Response;
use App\Shared\Middleware\AuthMiddleware;

class CategoryController {
    private CategoryRepository $repo;

    public function __construct() {
        $this->repo = new CategoryRepository();
    }

    public function index(): void {
        $categories = $this->repo->findAll();
        Response::success($categories, 'Lấy danh mục thành công');
    }

    public function store(): void {
        AuthMiddleware::requireAdmin();
        $data = Request::getBody();
        if (empty($data['name'])) {
            Response::error('Tên danh mục là bắt buộc', [], 400);
        }
        $category = $this->repo->create($data);
        Response::success($category, 'Tạo danh mục thành công', [], 201);
    }

    public function update(string $id): void {
        AuthMiddleware::requireAdmin();
        $data = Request::getBody();
        $category = $this->repo->update((int)$id, $data);
        if (!$category) {
            Response::error('Không tìm thấy danh mục', [], 404);
        }
        Response::success($category, 'Cập nhật danh mục thành công');
    }

    public function delete(string $id): void {
        AuthMiddleware::requireAdmin();
        try {
            $deleted = $this->repo->delete((int)$id);
            if (!$deleted) {
                Response::error('Không tìm thấy danh mục', [], 404);
            }
            Response::success(null, 'Xóa danh mục thành công');
        } catch (\Exception $e) {
            Response::error($e->getMessage(), [], 400);
        }
    }
}
