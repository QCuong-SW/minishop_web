<?php
namespace App\Auth;

use App\Shared\Database\Database;
use PDO;

class UserRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function findByEmail(string $email): ?array {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT id, name, email, role, avatar_url, phone, address, status, created_at FROM users WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public function create(array $data): int {
        $hash = password_hash($data['password'], PASSWORD_BCRYPT);
        $avatar = $data['avatar_url'] ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200';
        $stmt = $this->db->prepare("INSERT INTO users (name, email, password, role, avatar_url, phone, address, status) VALUES (:name, :email, :password, :role, :avatar_url, :phone, :address, 'ACTIVE')");
        $stmt->execute([
            ':name' => $data['name'],
            ':email' => $data['email'],
            ':password' => $hash,
            ':role' => $data['role'] ?? 'USER',
            ':avatar_url' => $avatar,
            ':phone' => $data['phone'] ?? null,
            ':address' => $data['address'] ?? null,
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function findAll(): array {
        $stmt = $this->db->query("SELECT id, name, email, role, avatar_url, phone, address, status, created_at FROM users ORDER BY id DESC");
        return $stmt->fetchAll();
    }

    public function toggleStatus(int $id): ?array {
        $user = $this->findById($id);
        if (!$user) return null;
        $newStatus = $user['status'] === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
        $stmt = $this->db->prepare("UPDATE users SET status = :status WHERE id = :id");
        $stmt->execute([':status' => $newStatus, ':id' => $id]);
        return $this->findById($id);
    }
}
