<?php
namespace App\Order;

use App\Shared\Http\Request;
use App\Shared\Http\Response;
use App\Shared\Middleware\AuthMiddleware;
use App\Shared\Database\Database;
use PDO;

class OrderController {
    public function index(): void {
        $user = AuthMiddleware::requireAuth();
        $db = Database::getConnection();

        $query = "SELECT * FROM orders";
        if ($user['role'] !== 'ADMIN') {
            $query .= " WHERE user_id = :uid";
        }
        $query .= " ORDER BY id DESC";

        $stmt = $db->prepare($query);
        if ($user['role'] !== 'ADMIN') {
            $stmt->bindValue(':uid', $user['id'], PDO::PARAM_INT);
        }
        $stmt->execute();
        $orders = $stmt->fetchAll();

        // Attach items
        foreach ($orders as &$order) {
            $this->formatOrder($order, $db);
        }

        Response::success($orders, 'Lấy danh sách đơn hàng thành công');
    }

    public function show(string $id): void {
        $user = AuthMiddleware::requireAuth();
        $db = Database::getConnection();

        $stmt = $db->prepare("SELECT * FROM orders WHERE id = :id OR order_code = :code LIMIT 1");
        $stmt->execute([':id' => is_numeric($id) ? (int)$id : 0, ':code' => $id]);
        $order = $stmt->fetch();

        if (!$order) {
            Response::error('Không tìm thấy đơn hàng', [], 404);
        }

        if ($user['role'] !== 'ADMIN' && (int)$order['user_id'] !== (int)$user['id']) {
            Response::error('Bạn không có quyền xem đơn hàng này', [], 403);
        }

        $this->formatOrder($order, $db);
        Response::success($order, 'Lấy chi tiết đơn hàng thành công');
    }

    public function create(): void {
        $user = AuthMiddleware::requireAuth();
        $data = Request::getBody();

        if (empty($data['shipping_name']) || empty($data['shipping_phone']) || empty($data['shipping_address'])) {
            Response::error('Vui lòng điền đầy đủ họ tên, SĐT và địa chỉ giao hàng', [], 400);
        }

        $db = Database::getConnection();

        try {
            $db->beginTransaction();

            // 1. Fetch user cart items
            $cartStmt = $db->prepare("SELECT c.*, p.name, p.price, p.stock, p.image_url FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = :uid FOR UPDATE");
            $cartStmt->execute([':uid' => $user['id']]);
            $cartItems = $cartStmt->fetchAll();

            if (empty($cartItems)) {
                throw new \Exception("Giỏ hàng của bạn đang trống!");
            }

            // 2. Validate stock & calculate subtotal
            $subtotal = 0.0;
            foreach ($cartItems as $item) {
                if ((int)$item['stock'] < (int)$item['quantity']) {
                    throw new \Exception("Sản phẩm '{$item['name']}' không đủ số lượng trong kho (Còn: {$item['stock']})");
                }
                $subtotal += (float)$item['price'] * (int)$item['quantity'];
            }

            $shippingFee = $subtotal >= 200000 ? 0.0 : 30000.0;
            $discountAmount = 0.0;
            $couponId = null;

            // 3. Validate coupon if provided
            if (!empty($data['coupon_code'])) {
                $cStmt = $db->prepare("SELECT * FROM coupons WHERE code = :code AND status = 'ACTIVE' LIMIT 1 FOR UPDATE");
                $cStmt->execute([':code' => strtoupper(trim($data['coupon_code']))]);
                $coupon = $cStmt->fetch();

                if ($coupon && $subtotal >= (float)$coupon['min_order_amount'] && (int)$coupon['used_count'] < (int)$coupon['usage_limit']) {
                    $couponId = (int)$coupon['id'];
                    if ($coupon['discount_type'] === 'FIXED') {
                        $discountAmount = (float)$coupon['discount_value'];
                    } else {
                        $discountAmount = ($subtotal * (float)$coupon['discount_value']) / 100;
                        if (!empty($coupon['max_discount']) && $discountAmount > (float)$coupon['max_discount']) {
                            $discountAmount = (float)$coupon['max_discount'];
                        }
                    }

                    // Increment coupon usage
                    $upC = $db->prepare("UPDATE coupons SET used_count = used_count + 1 WHERE id = :cid");
                    $upC->execute([':cid' => $couponId]);
                }
            }

            $finalAmount = max(0.0, $subtotal + $shippingFee - $discountAmount);
            $orderCode = 'ORD-' . date('Ymd') . '-' . rand(1000, 9999);
            $paymentMethod = $data['payment_method'] ?? 'COD';
            $paymentStatus = ($paymentMethod === 'MOCK_BANKING') ? 'PAID' : 'UNPAID';
            $orderStatus = ($paymentMethod === 'MOCK_BANKING') ? 'CONFIRMED' : 'PENDING';

            // 4. Insert Order
            $orderStmt = $db->prepare("INSERT INTO orders (order_code, user_id, coupon_id, total_amount, shipping_fee, discount_amount, final_amount, status, payment_method, payment_status, shipping_name, shipping_phone, shipping_address, note) VALUES (:order_code, :uid, :coupon_id, :total, :shipping, :discount, :final, :status, :payment_method, :payment_status, :shipping_name, :shipping_phone, :shipping_address, :note)");
            $orderStmt->execute([
                ':order_code' => $orderCode,
                ':uid' => $user['id'],
                ':coupon_id' => $couponId,
                ':total' => $subtotal,
                ':shipping' => $shippingFee,
                ':discount' => $discountAmount,
                ':final' => $finalAmount,
                ':status' => $orderStatus,
                ':payment_method' => $paymentMethod,
                ':payment_status' => $paymentStatus,
                ':shipping_name' => $data['shipping_name'],
                ':shipping_phone' => $data['shipping_phone'],
                ':shipping_address' => $data['shipping_address'],
                ':note' => $data['note'] ?? '',
            ]);

            $orderId = (int)$db->lastInsertId();

            // 5. Insert order_items & update stock
            $itemStmt = $db->prepare("INSERT INTO order_items (order_id, product_id, product_name_snapshot, product_image_snapshot, unit_price, quantity, subtotal) VALUES (:oid, :pid, :name, :image, :price, :qty, :subtotal)");
            $stockStmt = $db->prepare("UPDATE products SET stock = stock - :qty WHERE id = :pid");

            foreach ($cartItems as $item) {
                $itemSubtotal = (float)$item['price'] * (int)$item['quantity'];
                $itemStmt->execute([
                    ':oid' => $orderId,
                    ':pid' => $item['product_id'],
                    ':name' => $item['name'],
                    ':image' => $item['image_url'],
                    ':price' => (float)$item['price'],
                    ':qty' => (int)$item['quantity'],
                    ':subtotal' => $itemSubtotal,
                ]);

                $stockStmt->execute([
                    ':qty' => (int)$item['quantity'],
                    ':pid' => $item['product_id']
                ]);
            }

            // 6. Clear user cart
            $clearCart = $db->prepare("DELETE FROM cart_items WHERE user_id = :uid");
            $clearCart->execute([':uid' => $user['id']]);

            $db->commit();

            Response::success([
                'id' => $orderId,
                'order_code' => $orderCode,
                'total_amount' => $subtotal,
                'shipping_fee' => $shippingFee,
                'discount_amount' => $discountAmount,
                'final_amount' => $finalAmount,
                'status' => $orderStatus,
                'payment_method' => $paymentMethod,
                'payment_status' => $paymentStatus
            ], 'Đặt hàng thành công!', [], 201);

        } catch (\Exception $e) {
            if ($db->inTransaction()) {
                $db->rollBack();
            }
            Response::error($e->getMessage(), [], 400);
        }
    }

    public function updateStatus(string $id): void {
        AuthMiddleware::requireAdmin();
        $data = Request::getBody();
        $status = $data['status'] ?? 'CONFIRMED';

        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE orders SET status = :status, payment_status = CASE WHEN :status = 'DELIVERED' THEN 'PAID' ELSE payment_status END WHERE id = :id");
        $stmt->execute([':status' => $status, ':id' => (int)$id]);

        Response::success(['id' => (int)$id, 'status' => $status], 'Cập nhật trạng thái đơn hàng thành công');
    }

    public function cancel(string $id): void {
        $user = AuthMiddleware::requireAuth();
        $db = Database::getConnection();

        $stmt = $db->prepare("SELECT * FROM orders WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => (int)$id]);
        $order = $stmt->fetch();

        if (!$order) Response::error('Không tìm thấy đơn hàng', [], 404);
        if ($user['role'] !== 'ADMIN' && (int)$order['user_id'] !== (int)$user['id']) {
            Response::error('Bạn không có quyền hủy đơn này', [], 403);
        }
        if ($order['status'] !== 'PENDING') {
            Response::error('Chỉ có thể hủy đơn hàng đang ở trạng thái Chờ duyệt (PENDING)', [], 400);
        }

        $upStmt = $db->prepare("UPDATE orders SET status = 'CANCELLED' WHERE id = :id");
        $upStmt->execute([':id' => (int)$id]);

        Response::success(null, 'Hủy đơn hàng thành công');
    }

    private function formatOrder(array &$order, PDO $db): void {
        $order['total_amount'] = (float)$order['total_amount'];
        $order['shipping_fee'] = (float)$order['shipping_fee'];
        $order['discount_amount'] = (float)$order['discount_amount'];
        $order['final_amount'] = (float)$order['final_amount'];

        $itemStmt = $db->prepare("SELECT * FROM order_items WHERE order_id = :oid");
        $itemStmt->execute([':oid' => $order['id']]);
        $order['items'] = $itemStmt->fetchAll();

        foreach ($order['items'] as &$it) {
            $it['unit_price'] = (float)$it['unit_price'];
            $it['subtotal'] = (float)$it['subtotal'];
            $it['quantity'] = (int)$it['quantity'];
        }
    }
}
