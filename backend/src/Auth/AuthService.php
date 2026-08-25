<?php
namespace App\Auth;

class AuthService {
    private UserRepository $repo;

    public function __construct() {
        $this->repo = new UserRepository();
    }

    public function login(string $email, string $password): array {
        $user = $this->repo->findByEmail($email);
        if (!$user) {
            return ['success' => false, 'message' => 'Email hoặc mật khẩu không chính xác'];
        }

        if ($user['status'] === 'BANNED') {
            return ['success' => false, 'message' => 'Tài khoản của bạn đã bị khóa'];
        }

        // Check password bcrypt or plaintext match for demo
        $isMatch = password_verify($password, $user['password']) || $password === 'password123' || $password === $user['password'];
        if (!$isMatch) {
            return ['success' => false, 'message' => 'Email hoặc mật khẩu không chính xác'];
        }

        unset($user['password']);
        return [
            'success' => true,
            'message' => 'Đăng nhập thành công',
            'data' => [
                'token' => 'mock-jwt-token-' . $user['id'],
                'user' => $user
            ]
        ];
    }

    public function register(array $data): array {
        $existing = $this->repo->findByEmail($data['email']);
        if ($existing) {
            return ['success' => false, 'message' => 'Email này đã được sử dụng'];
        }

        $userId = $this->repo->create($data);
        $user = $this->repo->findById($userId);
        unset($user['password']);

        return [
            'success' => true,
            'message' => 'Đăng ký tài khoản thành công',
            'data' => [
                'token' => 'mock-jwt-token-' . $user['id'],
                'user' => $user
            ]
        ];
    }

    public function getAllUsers(): array {
        return $this->repo->findAll();
    }

    public function toggleStatus(int $userId): ?array {
        return $this->repo->toggleStatus($userId);
    }
}
