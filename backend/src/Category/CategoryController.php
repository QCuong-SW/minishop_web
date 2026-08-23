<?php
namespace App\Category;

use App\Shared\Database\Database;
use App\Shared\Http\Response;

class CategoryController {
    public function index(): void {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT * FROM categories WHERE status = 'ACTIVE' ORDER BY id ASC");
        $categories = $stmt->fetchAll();
        Response::success($categories, 'Lấy danh mục thành công');
    }
}
