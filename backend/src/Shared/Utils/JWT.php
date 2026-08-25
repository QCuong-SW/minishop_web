<?php
namespace App\Shared\Utils;

class JWT {
    private static string $defaultSecret = 'shopee-mini-jwt-secret-key-2026-secure';

    public static function getSecret(): string {
        return getenv('JWT_SECRET') ?: self::$defaultSecret;
    }

    /**
     * Encode payload array to standard JWT string (Header.Payload.Signature)
     */
    public static function encode(array $payload, ?string $secret = null, int $ttlSeconds = 604800): string {
        $secret = $secret ?: self::getSecret();

        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256'
        ];

        $now = time();
        $payload['iat'] = $payload['iat'] ?? $now;
        $payload['exp'] = $payload['exp'] ?? ($now + $ttlSeconds);

        $base64Header = self::base64UrlEncode(json_encode($header, JSON_UNESCAPED_SLASHES));
        $base64Payload = self::base64UrlEncode(json_encode($payload, JSON_UNESCAPED_SLASHES));

        $signature = hash_hmac('sha256', "$base64Header.$base64Payload", $secret, true);
        $base64Signature = self::base64UrlEncode($signature);

        return "$base64Header.$base64Payload.$base64Signature";
    }

    /**
     * Decode and verify standard JWT string
     */
    public static function decode(string $token, ?string $secret = null): ?array {
        $secret = $secret ?: self::getSecret();
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            return null;
        }

        [$base64Header, $base64Payload, $base64Signature] = $parts;

        // Verify Signature
        $expectedSignature = self::base64UrlEncode(hash_hmac('sha256', "$base64Header.$base64Payload", $secret, true));
        if (!hash_equals($expectedSignature, $base64Signature)) {
            return null;
        }

        $payload = json_decode(self::base64UrlDecode($base64Payload), true);
        if (!is_array($payload)) {
            return null;
        }

        // Check Expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null;
        }

        return $payload;
    }

    private static function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
    }
}
