<?php
namespace App\Shared\Middleware;

use App\Shared\Http\Response;

class AuthMiddleware {
    public static function getAuthenticatedUser(): ?array {
        $headers = getallheaders() ?: [];

        // 1. Fallback Mock Header (Giai đoạn đầu)
        if (isset($headers['X-User-Id'])) {
            return [
                'id' => (int)$headers['X-User-Id'],
                'role' => $headers['X-User-Role'] ?? 'USER'
            ];
        }

        // 2. Bearer Token JWT (Giai đoạn sau)
        if (isset($headers['Authorization']) && preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            // TODO: Giải mã JWT token
            return [
                'id' => 1,
                'role' => 'USER'
            ];
        }

        return null;
    }

    public static function requireAuth(): array {
        $user = self::getAuthenticatedUser();
        if (!$user) {
            Response::error('Vui lòng đăng nhập để tiếp tục', [], 401);
        }
        return $user;
    }

    public static function requireAdmin(): array {
        $user = self::requireAuth();
        if (($user['role'] ?? '') !== 'ADMIN') {
            Response::error('Bạn không có quyền truy cập khu vực quản trị', [], 403);
        }
        return $user;
    }
}
