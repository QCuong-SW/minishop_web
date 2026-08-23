<?php
namespace App\Coupon;
use App\Shared\Http\Request;
use App\Shared\Http\Response;

class CouponController {
    public function validate(): void {
        $data = Request::getBody();
        Response::success([
            'coupon_id' => 1,
            'code' => $data['code'] ?? 'WELCOME50K',
            'discount_amount' => 50000.00
        ], 'Áp dụng mã giảm giá thành công');
    }
}
