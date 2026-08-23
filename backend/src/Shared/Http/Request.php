<?php
namespace App\Shared\Http;

class Request {
    public static function getMethod(): string {
        return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    }

    public static function getUri(): string {
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $position = strpos($uri, '?');
        return $position !== false ? substr($uri, 0, $position) : $uri;
    }

    public static function getBody(): array {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        return is_array($data) ? $data : $_POST;
    }

    public static function getQueryParams(): array {
        return $_GET;
    }

    public static function getHeaders(): array {
        return getallheaders() ?: [];
    }
}
