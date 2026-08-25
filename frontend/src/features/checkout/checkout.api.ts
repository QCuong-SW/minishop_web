import { apiFetch } from "@/lib/api-client";
import { StorageService } from "@/lib/storage";
import { Order, PaymentMethod } from "@/types";

export interface ValidateCouponResult {
  success: boolean;
  coupon_id?: number;
  code?: string;
  discount_amount: number;
  description?: string;
  message?: string;
}

export const validateCouponApi = async (code: string, orderAmount: number): Promise<ValidateCouponResult> => {
  return apiFetch<ValidateCouponResult>(
    "/coupons/validate",
    {
      method: "POST",
      body: JSON.stringify({ code, order_amount: orderAmount }),
    },
    () => {
      const res = StorageService.validateCoupon(code, orderAmount);
      return {
        success: res.success,
        coupon_id: res.coupon?.id,
        code: res.coupon?.code,
        discount_amount: res.discount,
        description: res.coupon?.description,
        message: res.message,
      };
    }
  );
};

export const createOrderApi = async (payload: {
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  note?: string;
  payment_method: PaymentMethod;
  coupon_code?: string;
}): Promise<Order> => {
  return apiFetch<Order>(
    "/orders",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    () => {
      const currentUser = StorageService.getCurrentUser();
      return StorageService.createOrder({
        user_id: currentUser?.id || 2,
        customer_name: payload.shipping_name,
        shipping_name: payload.shipping_name,
        shipping_phone: payload.shipping_phone,
        shipping_address: payload.shipping_address,
        note: payload.note,
        payment_method: payload.payment_method,
        coupon_code: payload.coupon_code,
      });
    }
  );
};
