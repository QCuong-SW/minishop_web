<?php
declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

use App\Coupon\CouponService;
use App\Order\OrderService;
use App\Shared\Utils\JWT;

$tests = [];
$test = static function (string $name, callable $callback) use (&$tests): void { $tests[$name] = $callback; };
$assert = static function (bool $condition, string $message = 'Assertion failed'): void {
    if (!$condition) throw new RuntimeException($message);
};
$same = static function (mixed $expected, mixed $actual, string $message = ''): void {
    if ($expected !== $actual) throw new RuntimeException($message ?: 'Expected ' . var_export($expected, true) . ', got ' . var_export($actual, true));
};

$test('JWT creates three RFC 7519 segments', function () use ($same): void {
    $token = JWT::encode(['sub' => 2, 'role' => 'USER'], null, 60);
    $same(3, count(explode('.', $token)));
});
$test('JWT verifies signature and registered claims', function () use ($same): void {
    $payload = JWT::decode(JWT::encode(['sub' => 2, 'role' => 'USER'], null, 60));
    $same(2, $payload['sub']);
    $same('minishop-api', $payload['iss']);
    $same('minishop-web', $payload['aud']);
});
$test('JWT rejects tampered signature', function () use ($same): void {
    $token = JWT::encode(['sub' => 2], null, 60);
    $same(null, JWT::decode(substr($token, 0, -1) . ($token[-1] === 'a' ? 'b' : 'a')));
});
$test('JWT rejects expired token', function () use ($same): void {
    $same(null, JWT::decode(JWT::encode(['sub' => 2], null, -1)));
});
$test('fixed coupon never discounts below zero', function () use ($same): void {
    $same(100000.0, CouponService::calculateDiscount(['discount_type' => 'FIXED', 'discount_value' => 150000, 'max_discount' => null], 100000));
});
$test('percent coupon respects maximum discount', function () use ($same): void {
    $same(100000.0, CouponService::calculateDiscount(['discount_type' => 'PERCENT', 'discount_value' => 50, 'max_discount' => 100000], 500000));
});
$test('shipping is free from 200k', function () use ($same): void {
    $same(0.0, OrderService::shippingFee(200000));
    $same(30000.0, OrderService::shippingFee(199999));
});
$test('order state machine allows valid forward transition', function () use ($assert): void {
    $assert(OrderService::canTransition('PENDING', 'CONFIRMED'));
    $assert(OrderService::canTransition('SHIPPING', 'DELIVERED'));
});
$test('order state machine rejects skipping and terminal transitions', function () use ($assert): void {
    $assert(!OrderService::canTransition('PENDING', 'DELIVERED'));
    $assert(!OrderService::canTransition('DELIVERED', 'PENDING'));
});

$passed = 0;
foreach ($tests as $name => $callback) {
    try { $callback(); $passed++; echo "PASS {$name}\n"; }
    catch (Throwable $exception) { fwrite(STDERR, "FAIL {$name}: {$exception->getMessage()}\n"); }
}
echo "\n{$passed}/" . count($tests) . " tests passed\n";
exit($passed === count($tests) ? 0 : 1);
