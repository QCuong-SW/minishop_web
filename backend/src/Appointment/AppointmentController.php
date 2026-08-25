<?php
namespace App\Appointment;

use App\Shared\Http\Request;
use App\Shared\Http\Response;
use App\Shared\Middleware\AuthMiddleware;
use App\Shared\Database\Database;
use PDO;

class AppointmentController {
    public function index(): void {
        $user = AuthMiddleware::requireAuth();
        $db = Database::getConnection();

        $query = "SELECT a.*, u.name AS user_name, u.phone AS user_phone FROM appointments a JOIN users u ON a.user_id = u.id";
        if ($user['role'] !== 'ADMIN') {
            $query .= " WHERE a.user_id = :uid";
        }
        $query .= " ORDER BY a.id DESC";

        $stmt = $db->prepare($query);
        if ($user['role'] !== 'ADMIN') {
            $stmt->bindValue(':uid', $user['id'], PDO::PARAM_INT);
        }
        $stmt->execute();
        Response::success($stmt->fetchAll(), 'Lấy danh sách lịch hẹn thành công');
    }

    public function create(): void {
        $user = AuthMiddleware::requireAuth();
        $data = Request::getBody();

        if (empty($data['appointment_date']) || empty($data['appointment_time'])) {
            Response::error('Vui lòng chọn ngày và giờ hẹn', [], 400);
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("INSERT INTO appointments (user_id, appointment_date, appointment_time, service_type, guest_count, note, status) VALUES (:uid, :date, :time, :type, :guests, :note, 'PENDING')");
        $stmt->execute([
            ':uid' => $user['id'],
            ':date' => $data['appointment_date'],
            ':time' => $data['appointment_time'],
            ':type' => $data['service_type'] ?? 'Tư vấn & Thử đồ tại showroom',
            ':guests' => (int)($data['guest_count'] ?? 1),
            ':note' => $data['note'] ?? ''
        ]);

        Response::success(['id' => $db->lastInsertId(), 'status' => 'PENDING'], 'Đặt lịch hẹn showroom thành công!', [], 201);
    }

    public function updateStatus(string $id): void {
        AuthMiddleware::requireAdmin();
        $data = Request::getBody();
        $status = $data['status'] ?? 'CONFIRMED';

        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE appointments SET status = :status WHERE id = :id");
        $stmt->execute([':status' => $status, ':id' => (int)$id]);

        Response::success(['id' => (int)$id, 'status' => $status], 'Cập nhật trạng thái lịch hẹn thành công');
    }
}
