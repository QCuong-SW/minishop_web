<?php
namespace App\Appointment;
use App\Shared\Http\Request;
use App\Shared\Http\Response;
use App\Shared\Middleware\AuthMiddleware;

class AppointmentController {
    public function index(): void {
        $user = AuthMiddleware::requireAuth();
        Response::success([], 'Lấy danh sách lịch hẹn thành công');
    }

    public function create(): void {
        $user = AuthMiddleware::requireAuth();
        $data = Request::getBody();
        Response::success($data, 'Đặt lịch hẹn showroom thành công', [], 201);
    }
}
