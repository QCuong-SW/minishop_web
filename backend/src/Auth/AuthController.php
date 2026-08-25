<?php
namespace App\Auth;

use App\Shared\Http\Request;
use App\Shared\Http\Response;
use App\Shared\Middleware\AuthMiddleware;

class AuthController {
    private AuthService $service;

    public function __construct() {
        $this->service = new AuthService();
    }

    public function login(): void {
        $data = Request::getBody();
        if (empty($data['email']) || empty($data['password'])) {
            Response::error('Email và mật khẩu không được để trống', [], 400);
        }

        $result = $this->service->login($data['email'], $data['password']);
        if (!$result['success']) {
            Response::error($result['message'], [], 401);
        }

        Response::success($result['data'], $result['message']);
    }

    public function register(): void {
        $data = Request::getBody();
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            Response::error('Vui lòng điền đầy đủ họ tên, email và mật khẩu', [], 400);
        }

        $result = $this->service->register($data);
        if (!$result['success']) {
            Response::error($result['message'], [], 400);
        }

        Response::success($result['data'], $result['message'], [], 201);
    }

    public function me(): void {
        $user = AuthMiddleware::requireAuth();
        Response::success($user, 'Lấy thông tin người dùng thành công');
    }

    public function getUsers(): void {
        AuthMiddleware::requireAdmin();
        $users = $this->service->getAllUsers();
        Response::success($users, 'Lấy danh sách người dùng thành công');
    }

    public function toggleUserStatus(string $id): void {
        AuthMiddleware::requireAdmin();
        $updated = $this->service->toggleStatus((int)$id);
        Response::success($updated, 'Cập nhật trạng thái người dùng thành công');
    }
}
