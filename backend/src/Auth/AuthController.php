<?php
namespace App\Auth;

use App\Shared\Http\Request;
use App\Shared\Http\Response;

class AuthController {
    public function login(): void {
        $data = Request::getBody();
        // Mock Login Handler
        Response::success([
            'token' => 'mock-jwt-token-2026',
            'user' => [
                'id' => 1,
                'name' => 'Nguyễn Văn Khách',
                'email' => $data['email'] ?? 'user@shopee.com',
                'role' => ($data['email'] ?? '') === 'admin@shopee.com' ? 'ADMIN' : 'USER'
            ]
        ], 'Đăng nhập thành công');
    }

    public function register(): void {
        $data = Request::getBody();
        Response::success($data, 'Đăng ký tài khoản thành công', [], 201);
    }

    public function me(): void {
        Response::success([
            'id' => 1,
            'name' => 'Nguyễn Văn Khách',
            'email' => 'user@shopee.com',
            'role' => 'USER'
        ], 'Lấy thông tin người dùng thành công');
    }
}
