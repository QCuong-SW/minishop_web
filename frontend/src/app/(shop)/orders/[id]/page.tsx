"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EmptyState } from "@/components/shared/EmptyState";
import { ReviewModal } from "@/components/shared/ReviewModal";
import { getOrderByIdApi } from "@/features/orders/order.api";
import { Order, OrderStatus } from "@/types";
import { formatVND, formatDate } from "@/lib/utils";
import {
  ChevronRight,
  XCircle,
  MapPin,
  CreditCard,
  Printer,
  ArrowLeft,
  Star,
  Banknote,
  Building2,
} from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const [reviewModalData, setReviewModalData] = useState<{
    productId: number;
    productName: string;
    orderId: number;
  } | null>(null);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const found = await getOrderByIdApi(id);
      setOrder(found);
    } catch (err) {
      console.error("Error loading order detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full text-center">
          <p className="text-sm text-slate-500">Đang tải chi tiết đơn hàng...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
          <EmptyState
            title="Không tìm thấy đơn hàng"
            description="Mã đơn hàng không tồn tại hoặc bạn không có quyền truy cập đơn hàng này."
            actionText="Quay lại danh sách đơn"
            actionHref="/orders"
          />
        </main>
        <Footer />
      </div>
    );
  }

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: "PENDING", label: "Đặt Hàng", desc: "Chờ duyệt" },
    { key: "CONFIRMED", label: "Đã Xác Nhận", desc: "Đóng gói bưu kiện" },
    { key: "SHIPPING", label: "Đang Vận Chuyển", desc: "Shipper đang giao" },
    { key: "DELIVERED", label: "Hoàn Thành", desc: "Giao thành công" },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return 0;
      case "CONFIRMED":
      case "PROCESSING":
        return 1;
      case "SHIPPING":
        return 2;
      case "DELIVERED":
        return 3;
      default:
        return -1;
    }
  };

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-shopee-orange">Trang chủ</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/orders" className="hover:text-shopee-orange">Đơn hàng</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-mono font-bold text-slate-800">{order.order_code}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              Chi Tiết Đơn Hàng: <span className="text-shopee-orange font-mono">{order.order_code}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 shadow-sm flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" /> In hóa đơn
            </button>
            <Link
              href="/orders"
              className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Danh sách đơn
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            Tiến Độ Vận Chuyển
          </h3>

          {isCancelled ? (
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 flex items-center gap-3 text-rose-700">
              <XCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">Đơn hàng đã bị hủy</p>
                <p className="text-xs text-rose-600">Đơn hàng này không còn được tiếp tục xử lý vận chuyển.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
              {steps.map((step, index) => {
                const isPassed = index <= currentStep;
                const isCurrent = index === currentStep;

                return (
                  <div
                    key={step.key}
                    className={`p-4 rounded-2xl border transition-all text-center space-y-2 relative ${
                      isCurrent
                        ? "bg-orange-50/80 border-shopee-orange shadow-md scale-102"
                        : isPassed
                        ? "bg-slate-50 border-emerald-300 text-emerald-800"
                        : "bg-slate-50/50 border-slate-200 text-slate-400 opacity-60"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                        isCurrent
                          ? "bg-shopee-orange text-white shadow"
                          : isPassed
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isPassed ? "✓" : index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">{step.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-shopee-orange" />
              <span>Địa Chỉ Giao Hàng</span>
            </div>
            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-800 text-sm">{order.shipping_name}</p>
              <p className="text-slate-600">Số điện thoại: <strong>{order.shipping_phone}</strong></p>
              <p className="text-slate-600 leading-relaxed">
                Địa chỉ: {order.shipping_address}
              </p>
              {order.note && (
                <p className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-500 italic">
                  Ghi chú: &quot;{order.note}&quot;
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
              <CreditCard className="w-4 h-4 text-shopee-orange" />
              <span>Thanh Toán & Hóa Đơn</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Phương thức:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  {order.payment_method === "MOCK_BANKING" ? (
                    <>
                      <Building2 className="w-4 h-4 text-blue-600" /> Chuyển khoản ngân hàng
                    </>
                  ) : (
                    <>
                      <Banknote className="w-4 h-4 text-emerald-600" /> Tiền mặt khi nhận (COD)
                    </>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Trạng thái thanh toán:</span>
                <span
                  className={`font-bold px-2.5 py-0.5 rounded-full ${
                    order.payment_status === "PAID"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {order.payment_status === "PAID" ? "Đã Thanh Toán (PAID)" : "Chưa Thanh Toán (UNPAID)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Thời gian tạo đơn:</span>
                <span className="font-semibold text-slate-800">{formatDate(order.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            Danh Sách Sản Phẩm Trong Đơn
          </h3>

          <div className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product_image_snapshot}
                    alt={item.product_name_snapshot}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600";
                    }}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-sm">{item.product_name_snapshot}</p>
                    <p className="text-slate-400">
                      Đơn giá: {formatVND(item.unit_price)} x {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <span className="font-black text-slate-900 text-sm">
                    {formatVND(item.subtotal)}
                  </span>

                  {order.status === "DELIVERED" && (
                    <button
                      type="button"
                      onClick={() =>
                        setReviewModalData({
                          productId: item.product_id,
                          productName: item.product_name_snapshot,
                          orderId: order.id,
                        })
                      }
                      className="px-3 py-1.5 bg-orange-50 text-shopee-orange font-bold text-xs rounded-xl hover:bg-shopee-orange hover:text-white transition flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5" /> Đánh Giá
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col items-end space-y-2 text-xs">
            <div className="w-full sm:w-72 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Tổng tiền hàng:</span>
                <span className="font-semibold text-slate-800">{formatVND(order.total_amount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Phí vận chuyển:</span>
                <span className="font-semibold text-slate-800">
                  {order.shipping_fee === 0 ? "Miễn phí" : `+${formatVND(order.shipping_fee)}`}
                </span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Mã giảm giá ({order.coupon_code || "Coupon"}):</span>
                  <span>-{formatVND(order.discount_amount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-sm">Tổng thanh toán:</span>
                <span className="text-xl font-black text-shopee-orange">
                  {formatVND(order.final_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {reviewModalData && (
        <ReviewModal
          isOpen={true}
          productId={reviewModalData.productId}
          productName={reviewModalData.productName}
          orderId={reviewModalData.orderId}
          onClose={() => setReviewModalData(null)}
          onSuccess={() => fetchOrderDetail()}
        />
      )}

      <Footer />
    </div>
  );
}
