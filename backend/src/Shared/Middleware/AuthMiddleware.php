<?php
namespace App\Shared\Middleware;

use App\Shared\Http\Request;
use App\Shared\Http\Response;
use App\Shared\Database\Database;
use PDO;

class AuthMiddleware {
    public static function getAuthenticatedUser(): ?array {
        $headers = Request::getHeaders();

        // 1. Check Header X-User-Id
        $userId = $headers['X-User-Id'] ?? $headers['x-user-id'] ?? null;
        if ($userId) {
            $db = Database::getConnection();
            $stmt = $db->prepare("SELECT id, name, email, role, avatar_url, phone, address, status FROM users WHERE id = :id AND status = 'ACTIVE' LIMIT 1");
            $stmt->execute([':id' => (int)$userId]);
            $user = $stmt->fetch();
            if ($user) {
                return $user;
            }
        }

        // 2. Check Bearer Token
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
        if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            // If token is mock format: mock-jwt-token-{id} or default
            if (preg_match('/^mock-jwt-token-(\d+)$/', $token, $m)) {
                $db = Database::getConnection();
                $stmt = $db->prepare("SELECT id, name, email, role, avatar_url, phone, address, status FROM users WHERE id = :id LIMIT 1");
                $stmt->execute([':id' => (int)$m[1]]);
                $user = $stmt->fetch();
                if ($user) return $user;
            }
            // Fallback default active user
            $db = Database::getConnection();
            $stmt = $db->query("SELECT id, name, email, role, avatar_url, phone, address, status FROM users WHERE role = 'USER' AND status = 'ACTIVE' LIMIT 1");
            return $stmt->fetch() ?: null;
        }

        return null;
    }

    public static function requireAuth(): array {
        $user = self::getAuthenticatedUser();
        if (!$user) {
            Response::error('Vui lòng đăng nhập để thực hiện thao tác này', [], 401);
        }
        return $user;
    }

    public static function requireAdmin(): array {
        $user = self::requireAuth();
        if (($user['role'] ?? '') !== 'ADMIN') {
            Response::error('Bạn không có quyền quản trị viên', [], 403);
        }
        return $user;
    }
}
