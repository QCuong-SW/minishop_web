"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatVND } from "@/lib/utils";
import { validateCouponApi, createOrderApi } from "@/features/checkout/checkout.api";
import { Order, PaymentMethod } from "@/types";
import { toast } from "sonner";
import {
  CreditCard,
  MapPin,
  Ticket,
  CheckCircle2,
  PackageCheck,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  const selectedItems = cart.filter((item) => item.selected !== false);
  const subtotal = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);
  const initialShipping = subtotal >= 200000 ? 0 : 30000;

  // Form State
  const [shippingName, setShippingName] = useState(user?.name || "Nguyễn Văn Khách");
  const [shippingPhone, setShippingPhone] = useState(user?.phone || "0987654321");
  const [shippingAddress, setShippingAddress] = useState(
    user?.address || "123 Nguyễn Trãi, Phường 2, Quận 5, TP. Hồ Chí Minh"
  );
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MOCK_BANKING");

  // Coupon State
  const [couponInput, setCouponInput] = useState("WELCOME50K");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    description: string;
  } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      if (!shippingName) setShippingName(user.name);
      if (!shippingPhone && user.phone) setShippingPhone(user.phone);
      if (!shippingAddress && user.address) setShippingAddress(user.address);
    }
  }, [user]);

  // Auto test validate default coupon on load
  useEffect(() => {
    async function autoValidate() {
      if (subtotal >= 300000 && !appliedCoupon) {
        try {
          const res = await validateCouponApi("WELCOME50K", subtotal);
          if (res.discount_amount > 0) {
            setAppliedCoupon({
              code: res.code || "WELCOME50K",
              discount: res.discount_amount,
              description: res.description || "Giảm ngay 50k",
            });
          }
        } catch {}
      }
    }
    autoValidate();
  }, [subtotal]);

  const handleApplyCoupon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) {
      toast.error("Vui lòng nhập mã khuyến mãi!");
      return;
    }

    setIsValidatingCoupon(true);
    try {
      const result = await validateCouponApi(couponInput.trim(), subtotal);
      if (result.discount_amount > 0) {
        setAppliedCoupon({
          code: result.code || couponInput.trim(),
          discount: result.discount_amount,
          description: result.description || "Mã giảm giá hợp lệ",
        });
        toast.success(result.message || `Áp dụng mã ${result.code} thành công! Giảm ${formatVND(result.discount_amount)}.`);
      } else {
        toast.error(result.message || "Mã giảm giá không hợp lệ");
      }
    } catch (err: any) {
      toast.error(err.message || "Mã giảm giá không tồn tại hoặc đã hết hạn!");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    toast.info("Đã hủy áp dụng mã giảm giá");
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalAmount = Math.max(0, subtotal + initialShipping - discountAmount);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      toast.error("Không có sản phẩm nào trong đơn hàng để thanh toán!");
      return;
    }

    // Check stock before submitting
    for (const item of selectedItems) {
      const prod = StorageService.getProductById(item.product_id);
      if (!prod || prod.stock <= 0 || prod.status === "INACTIVE") {
        toast.error(`Sản phẩm "${item.name}" hiện đã hết hàng. Vui lòng quay lại giỏ hàng để điều chỉnh!`);
        return;
      }
      if (item.quantity > prod.stock) {
        toast.error(`Sản phẩm "${item.name}" chỉ còn ${prod.stock} món trong kho. Vui lòng giảm số lượng!`);
        return;
      }
    }

    if (!shippingName.trim() || !shippingPhone.trim() || !shippingAddress.trim()) {
      toast.error("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!");
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await createOrderApi({
        shipping_name: shippingName.trim(),
        shipping_phone: shippingPhone.trim(),
        shipping_address: shippingAddress.trim(),
        note: note.trim(),
        payment_method: paymentMethod,
        coupon_code: appliedCoupon?.code,
      });

      setCreatedOrder(order);
      clearCart();
      toast.success("🎉 Chúc mừng! Đặt hàng thành công qua Database Transaction.");
    } catch (err: any) {
      toast.error(err.message || "Đặt hàng thất bại, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was successfully created, show celebratory success screen
  if (createdOrder) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <PackageCheck className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Giao Dịch Thành Công
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900">
                Đặt Hàng Thành Công!
              </h1>
              <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Cảm ơn bạn đã tin tưởng mua sắm tại MiniShop. Đơn hàng của bạn đã được tiếp nhận và xử lý qua Database Transaction an toàn.
              </p>
            </div>

            {/* Order Summary Box */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 text-left space-y-3 text-xs max-w-lg mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Mã đơn hàng:</span>
                <span className="font-mono font-bold text-shopee-orange text-sm">
                  {createdOrder.order_code}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Người nhận:</span>
                <span className="font-semibold text-slate-800">{createdOrder.shipping_name} ({createdOrder.shipping_phone})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Địa chỉ giao:</span>
                <span className="font-semibold text-slate-800 text-right max-w-[240px] truncate">{createdOrder.shipping_address}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Phương thức thanh toán:</span>
                <span className="font-bold text-slate-800">
                  {createdOrder.payment_method === "MOCK_BANKING" ? "🏦 Chuyển khoản (Đã thanh toán)" : "💵 COD (Khi nhận hàng)"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm">
                <span className="font-bold text-slate-800">Tổng thanh toán:</span>
                <span className="font-black text-shopee-orange text-base">{formatVND(createdOrder.final_amount)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href={`/orders/${createdOrder.id}`}
                className="w-full sm:w-auto px-7 py-3.5 bg-shopee-orange text-white font-bold text-sm rounded-2xl shadow-lg hover:bg-shopee-hover transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Xem Tiến Độ Đơn Hàng</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products"
                className="w-full sm:w-auto px-7 py-3.5 bg-slate-100 text-slate-700 font-bold text-sm rounded-2xl hover:bg-slate-200 transition"
              >
                Tiếp Tục Mua Sắm
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If cart is empty and not ordered
  if (selectedItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
          <div className="bg-white rounded-3xl p-12 border border-slate-200/80 shadow-sm text-center space-y-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-slate-800">Chưa có sản phẩm nào được chọn</h2>
            <p className="text-xs text-slate-500">
              Vui lòng quay lại giỏ hàng và tích chọn ít nhất 1 sản phẩm trước khi tiến hành thanh toán nhé!
            </p>
            <Link
              href="/cart"
              className="inline-block px-6 py-2.5 bg-shopee-orange text-white font-bold text-xs rounded-xl shadow hover:bg-shopee-hover transition"
            >
              Quay lại Giỏ hàng
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-shopee-orange">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/cart" className="hover:text-shopee-orange">Giỏ hàng</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800">Thanh Toán & Đặt Hàng</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-50 text-shopee-orange rounded-2xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">
              Xác Nhận Đơn Hàng & Thanh Toán
            </h1>
            <p className="text-xs text-slate-500">Kiểm tra thông tin giao nhận và thanh toán đơn hàng</p>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: Recipient Form & Payment Options */}
            <div className="lg:col-span-7 space-y-6">
              {/* Section 1: Shipping Info */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-5">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                  <div className="p-2 bg-orange-50 text-shopee-orange rounded-xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                      1. Thông Tin Nhận Hàng
                    </h2>
                    <p className="text-[11px] text-slate-400">Địa chỉ shipper sẽ giao bưu kiện tới</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 block">
                        Họ và tên người nhận (*)
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingName}
                        onChange={(e) => setShippingName(e.target.value)}
                        placeholder="Ví dụ: Nguyễn Văn A"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange focus:bg-white transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 block">
                        Số điện thoại nhận hàng (*)
                      </label>
                      <input
                        type="tel"
                        required
                        value={shippingPhone}
                        onChange={(e) => setShippingPhone(e.target.value)}
                        placeholder="Ví dụ: 0987654321"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">
                      Địa chỉ nhận hàng chi tiết (*)
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange focus:bg-white transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">
                      Ghi chú đơn hàng (Tùy chọn)
                    </label>
                    <textarea
                      rows={2}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi tới..."
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange focus:bg-white transition resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Payment Methods */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-5">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                  <div className="p-2 bg-orange-50 text-shopee-orange rounded-xl">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                      2. Phương Thức Thanh Toán
                    </h2>
                    <p className="text-[11px] text-slate-400">Chọn hình thức thuận tiện nhất cho bạn</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Mock Banking Option */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition ${
                      paymentMethod === "MOCK_BANKING"
                        ? "border-shopee-orange bg-orange-50/50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="MOCK_BANKING"
                      checked={paymentMethod === "MOCK_BANKING"}
                      onChange={() => setPaymentMethod("MOCK_BANKING")}
                      className="mt-0.5 text-shopee-orange focus:ring-shopee-orange accent-shopee-orange"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          Chuyển Khoản Ngân Hàng (Mock Banking)
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Khuyên dùng
                        </span>
                      </div>
                      <p className="text-slate-500 leading-relaxed">
                        Thanh toán mô phỏng thành công ngay lập tức! Đơn hàng được tự động xác nhận và đánh dấu Đã Thanh Toán (PAID).
                      </p>
                    </div>
                  </label>

                  {/* COD Option */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition ${
                      paymentMethod === "COD"
                        ? "border-shopee-orange bg-orange-50/50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="mt-0.5 text-shopee-orange focus:ring-shopee-orange accent-shopee-orange"
                    />
                    <div className="space-y-1">
                      <span className="font-bold text-slate-900">
                        Thanh Toán Khi Nhận Hàng (COD)
                      </span>
                      <p className="text-slate-500 leading-relaxed">
                        Khách hàng thanh toán tiền mặt trực tiếp cho nhân viên giao hàng sau khi kiểm tra kiện hàng.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Order Summary & Coupon Breakdown */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6 sticky top-24">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base border-b border-slate-100 pb-3">
                  3. Tóm Tắt Đơn Hàng ({selectedItems.length} sản phẩm)
                </h3>

                {/* Items Snapshot */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {selectedItems.map((item) => (
                    <div key={item.product_id} className="flex items-center gap-3 text-xs">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600";
                        }}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {formatVND(item.price)} x {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-slate-900 flex-shrink-0">
                        {formatVND(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-shopee-orange" />
                    <span className="text-xs font-bold text-slate-800">Mã Giảm Giá (Coupon)</span>
                  </div>

                  {appliedCoupon ? (
                    <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Mã: {appliedCoupon.code}
                        </span>
                        <p className="text-[10px] text-emerald-600">
                          Đã giảm {formatVND(appliedCoupon.discount)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-[11px] font-bold text-rose-500 hover:underline"
                      >
                        Bỏ mã
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Nhập mã: WELCOME50K, FREESHIP..."
                        className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-shopee-orange uppercase font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        disabled={isValidatingCoupon}
                        className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition active:scale-95 disabled:opacity-50"
                      >
                        Áp Dụng
                      </button>
                    </div>
                  )}

                  {/* Demo Coupon Suggestions */}
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => {
                        setCouponInput("WELCOME50K");
                      }}
                      className="px-2 py-0.5 bg-orange-50 text-shopee-orange border border-orange-200 rounded-md font-bold hover:bg-orange-100 transition"
                    >
                      Mã WELCOME50K (-50k)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCouponInput("FREESHIP");
                      }}
                      className="px-2 py-0.5 bg-orange-50 text-shopee-orange border border-orange-200 rounded-md font-bold hover:bg-orange-100 transition"
                    >
                      Mã FREESHIP (-30k)
                    </button>
                  </div>
                </div>

                {/* Financial Breakdown */}
                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Tổng tiền hàng:</span>
                    <span className="font-semibold text-slate-800">{formatVND(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Phí vận chuyển:</span>
                    <span className="font-semibold text-slate-800">
                      {initialShipping === 0 ? (
                        <span className="text-emerald-600 font-bold">Miễn phí</span>
                      ) : (
                        `+${formatVND(initialShipping)}`
                      )}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Giảm giá khuyến mãi:</span>
                      <span>-{formatVND(discountAmount)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-sm">Tổng thanh toán:</span>
                    <span className="text-2xl font-black text-shopee-orange">
                      {formatVND(finalAmount)}
                    </span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-gradient-to-r from-shopee-orange to-amber-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/30 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Đang Xử Lý Giao Dịch...</span>
                  ) : (
                    <>
                      <span>XÁC NHẬN ĐẶT HÀNG</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
