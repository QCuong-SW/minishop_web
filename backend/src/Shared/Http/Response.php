<?php
namespace App\Shared\Http;

class Response {
    public static function json(array $data, int $status = 200): void {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    public static function success(mixed $data = null, string $message = 'Thành công', array $meta = [], int $status = 200): void {
        $response = [
            'success' => true,
            'message' => $message,
            'data' => $data
        ];
        if (!empty($meta)) {
            $response['meta'] = $meta;
        }
        self::json($response, $status);
    }

    public static function error(string $message = 'Có lỗi xảy ra', array $errors = [], int $status = 400): void {
        $response = [
            'success' => false,
            'message' => $message
        ];
        if (!empty($errors)) {
            $response['errors'] = $errors;
        }
        self::json($response, $status);
    }
}
