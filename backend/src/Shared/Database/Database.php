<?php
namespace App\Shared\Database;

use PDO;
use PDOException;

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $config = require __DIR__ . '/../../../config/database.php';
            $dsn = "mysql:host={$config['host']};port={$config['port']};dbname={$config['database']};charset={$config['charset']}";
            
            $retries = 5;
            while ($retries > 0) {
                try {
                    self::$instance = new PDO($dsn, $config['username'], $config['password'], [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false,
                    ]);
                    break;
                } catch (PDOException $e) {
                    $retries--;
                    if ($retries === 0) {
                        http_response_code(500);
                        header('Content-Type: application/json; charset=utf-8');
                        echo json_encode([
                            'success' => false,
                            'message' => 'Lỗi kết nối cơ sở dữ liệu: ' . $e->getMessage()
                        ], JSON_UNESCAPED_UNICODE);
                        exit;
                    }
                    sleep(1);
                }
            }
        }
        return self::$instance;
    }
}
