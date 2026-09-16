<?php
declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

use App\Order\OrderService;
use App\Shared\Database\Database;

$db = Database::getConnection();
$service = new OrderService();
$userId = 3;
$productId = 104;

$beforeStmt = $db->prepare('SELECT stock, sold_count FROM products WHERE id = :id');
$beforeStmt->execute([':id' => $productId]);
$before = $beforeStmt->fetch();
if (!$before) throw new RuntimeException('Checkout test product is missing');

$created = $service->create($userId, [
    'payment_method' => 'COD',
    'shipping_name' => 'Trần Thị Thảo',
    'shipping_phone' => '0912345678',
    'shipping_address' => '456 Lê Văn Sỹ, Quận 3, TP.HCM',
]);

if (($created['status'] ?? null) !== 'PENDING') throw new RuntimeException('COD order must start as PENDING');
$orderId = (int)$created['id'];

$afterCreateStmt = $db->prepare('SELECT p.stock, p.sold_count, o.total_amount, o.final_amount, o.status FROM products p JOIN orders o ON o.id = :order_id WHERE p.id = :product_id');
$afterCreateStmt->execute([':order_id' => $orderId, ':product_id' => $productId]);
$afterCreate = $afterCreateStmt->fetch();
if (!$afterCreate
    || (int)$afterCreate['stock'] !== (int)$before['stock'] - 1
    || (int)$afterCreate['sold_count'] !== (int)$before['sold_count'] + 1
    || (float)$afterCreate['total_amount'] !== 399000.0
    || (float)$afterCreate['final_amount'] !== 399000.0
    || $afterCreate['status'] !== 'PENDING') {
    throw new RuntimeException('Checkout transaction produced inconsistent data');
}

$cartStmt = $db->prepare('SELECT COUNT(*) FROM cart_items WHERE user_id = :user_id');
$cartStmt->execute([':user_id' => $userId]);
if ((int)$cartStmt->fetchColumn() !== 0) throw new RuntimeException('Checkout did not clear the cart');

$cancelled = $service->cancel($orderId, ['id' => $userId, 'role' => 'USER']);
if (($cancelled['status'] ?? null) !== 'CANCELLED') throw new RuntimeException('Order cancellation failed');

$afterCancelStmt = $db->prepare('SELECT stock, sold_count FROM products WHERE id = :id');
$afterCancelStmt->execute([':id' => $productId]);
$afterCancel = $afterCancelStmt->fetch();
if (!$afterCancel
    || (int)$afterCancel['stock'] !== (int)$before['stock']
    || (int)$afterCancel['sold_count'] !== (int)$before['sold_count']) {
    throw new RuntimeException('Cancellation did not restore stock and sold_count');
}

echo "PASS checkout transaction and cancellation against MySQL\n";
