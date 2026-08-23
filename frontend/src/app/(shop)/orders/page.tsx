"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { ReviewModal } from "@/components/shared/ReviewModal";
import { StorageService } from "@/lib/storage";
import { useAuth } from "@/context/AuthContext";
import { Order, OrderStatus } from "@/types";
import { formatVND, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  Package,
  ChevronRight,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Eye,
  Star,
  RefreshCw,
} from "lucide-react";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);

  // Review Modal State
  const [reviewModalData, setReviewModalData] = useState<{
    productId: number;
    productName: string;
    orderId: number;
  } | null>(null);

  const fetchOrders = () => {
    StorageService.init();
    const list = StorageService.getOrders(user?.id || 2);
    setOrders(list);
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleCancelOrder = (orderId: number) => {
    try {
      StorageService.cancelOrder(orderId);
      toast.success("Đã hủy đơn hàng thành công!");
      fetchOrders();
    } catch (err: any) {
      toast.error(err.message || "Không thể hủy đơn hàng");
    } finally {
      setCancellingOrderId(null);
    }
  };

  const statusConfig: Record<
    OrderStatus,
    { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    PENDING: { label: "Chờ Duyệt", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
    CONFIRMED: { label: "Đã Xác Nhận", color: "bg-blue-50 text-blue-700 border-blue-200", icon: CheckCircle2 },
    PROCESSING: { label: "Đang Xử Lý", color: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: RefreshCw },
    SHIPPING: { label: "Đang Giao Hàng", color: "bg-purple-50 text-purple-700 border-purple-200", icon: Truck },
    DELIVERED: { label: "Giao Thành Công", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
    CANCELLED: { label: "Đã Hủy", color: "bg-rose-50 text-rose-700 border-rose-200", icon: XCircle },
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "ALL") return true;
    return order.status === activeTab;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-shopee-orange">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800">Đơn Hàng Của Tôi</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">📑 Đơn Hàng Của Tôi</h1>
            <p className="text-xs text-slate-500">Theo dõi tiến độ vận chuyển và lịch sử mua sắm</p>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none text-xs font-bold">
          {[
            { id: "ALL", label: "Tất Cả" },
            { id: "PENDING", label: "Chờ Duyệt" },
            { id: "PROCESSING", label: "Đang Xử Lý" },
            { id: "SHIPPING", label: "Đang Giao" },
            { id: "DELIVERED", label: "Đã Giao" },
            { id: "CANCELLED", label: "Đã Hủy" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-shopee-orange text-white shadow-md shadow-orange-200"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusInfo = statusConfig[order.status] || statusConfig.PENDING;
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {order.order_code}
                      </span>
                      <span className="text-slate-400">|</span>
                      <span className="text-slate-500">{formatDate(order.created_at)}</span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{statusInfo.label}</span>
                    </span>
                  </div>

                  {/* Order Items Snapshot */}
                  <div className="divide-y divide-slate-100">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={item.product_image_snapshot}
                            alt={item.product_name_snapshot}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-900 text-sm line-clamp-1">
                              {item.product_name_snapshot}
                            </p>
                            <p className="text-slate-400">
                              Số lượng: x{item.quantity} | Đơn giá: {formatVND(item.unit_price)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-end sm:self-center">
                          <span className="font-bold text-slate-800 text-sm">
                            {formatVND(item.subtotal)}
                          </span>

                          {/* Rate button if order DELIVERED */}
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

                  {/* Order Bottom Bar */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-xs text-slate-500">
                      <span>Hình thức: </span>
                      <strong className="text-slate-800">
                        {order.payment_method === "MOCK_BANKING" ? "Chuyển khoản (Mock)" : "Tiền mặt (COD)"}
                      </strong>
                      <span className="text-slate-300 mx-2">|</span>
                      <span>Trạng thái thanh toán: </span>
                      <strong className={order.payment_status === "PAID" ? "text-emerald-600" : "text-amber-600"}>
                        {order.payment_status === "PAID" ? "Đã Thanh Toán" : "Chưa Thanh Toán"}
                      </strong>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Tổng thanh toán:</span>
                        <span className="text-lg font-black text-shopee-orange">
                          {formatVND(order.final_amount)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.status === "PENDING" && (
                          <button
                            type="button"
                            onClick={() => setCancellingOrderId(order.id)}
                            className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 font-bold text-xs hover:bg-rose-50 transition"
                          >
                            Hủy Đơn
                          </button>
                        )}

                        <Link
                          href={`/orders/${order.id}`}
                          className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> Chi Tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Không có đơn hàng nào"
            description="Bạn chưa có đơn hàng nào ở trạng thái này. Hãy dạo quanh cửa hàng để tìm món đồ ưng ý nhé!"
            actionText="Khám phá sản phẩm ngay"
            actionHref="/products"
          />
        )}
      </main>

      {/* Cancel Order Confirm Modal */}
      <ConfirmModal
        isOpen={cancellingOrderId !== null}
        title="Xác nhận hủy đơn hàng?"
        message="Bạn có chắc chắn muốn hủy đơn hàng này? Thao tác này không thể hoàn tác."
        confirmText="Hủy Đơn Hàng"
        variant="danger"
        onConfirm={() => cancellingOrderId && handleCancelOrder(cancellingOrderId)}
        onCancel={() => setCancellingOrderId(null)}
      />

      {/* Review Modal */}
      {reviewModalData && (
        <ReviewModal
          isOpen={true}
          productId={reviewModalData.productId}
          productName={reviewModalData.productName}
          orderId={reviewModalData.orderId}
          onClose={() => setReviewModalData(null)}
          onSuccess={() => fetchOrders()}
        />
      )}

      <Footer />
    </div>
  );
}
