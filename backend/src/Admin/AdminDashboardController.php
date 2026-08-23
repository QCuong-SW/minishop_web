<?php
namespace App\Admin;
use App\Shared\Http\Response;
use App\Shared\Middleware\AuthMiddleware;

class AdminDashboardController {
    public function stats(): void {
        AuthMiddleware::requireAdmin();
        Response::success([
            'overview' => [
                'total_revenue' => 15420000.00,
                'total_orders' => 128,
                'total_products' => 45,
                'total_users' => 64
            ],
            'recent_orders' => []
        ], 'Lấy thống kê dashboard thành công');
    }
}
