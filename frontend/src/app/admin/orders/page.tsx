"use client";

import React, { useState, useEffect } from "react";
import { StorageService } from "@/lib/storage";
import { Order, OrderStatus } from "@/types";
import { formatVND, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  ShoppingBag,
  Search,
  Eye,
  X,
  MapPin,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [keyword, setKeyword] = useState("");
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const fetchOrders = () => {
    StorageService.init();
    const list = StorageService.getOrders();
    setOrders(list);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    try {
      StorageService.updateOrderStatus(orderId, newStatus);
      toast.success(`Đã cập nhật trạng thái đơn #${orderId} thành ${newStatus}!`);
      fetchOrders();
      if (viewingOrder && viewingOrder.id === orderId) {
        setViewingOrder(StorageService.getOrderById(orderId));
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi đổi trạng thái");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    const matchKeyword =
      !keyword.trim() ||
      o.order_code.toLowerCase().includes(keyword.toLowerCase().trim()) ||
      o.shipping_name.toLowerCase().includes(keyword.toLowerCase().trim()) ||
      o.shipping_phone.includes(keyword.trim());
    return matchStatus && matchKeyword;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          📑 Quản Lý & Duyệt Đơn Hàng
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Theo dõi luồng xử lý đơn hàng từ lúc đặt cho đến khi shipper giao thành công
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-bold scrollbar-none">
          {[
            { id: "ALL", label: "Tất Cả" },
            { id: "PENDING", label: "Chờ Duyệt" },
            { id: "CONFIRMED", label: "Đã Xác Nhận" },
            { id: "SHIPPING", label: "Đang Giao" },
            { id: "DELIVERED", label: "Đã Giao" },
            { id: "CANCELLED", label: "Đã Hủy" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                statusFilter === tab.id
                  ? "bg-shopee-orange text-white shadow"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo Mã đơn, Tên, SĐT..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Mã Đơn</th>
                <th className="p-4">Khách Hàng / SĐT</th>
                <th className="p-4">Ngày Đặt</th>
                <th className="p-4">Thanh Toán</th>
                <th className="p-4">Tổng Tiền</th>
                <th className="p-4">Đổi Trạng Thái Đơn</th>
                <th className="p-4 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-mono font-bold text-slate-900 text-sm">
                      {ord.order_code}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{ord.shipping_name}</p>
                      <span className="text-[11px] text-slate-400">{ord.shipping_phone}</span>
                    </td>
                    <td className="p-4 text-slate-500">{formatDate(ord.created_at)}</td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-800 block">
                        {ord.payment_method === "MOCK_BANKING" ? "Mock Banking" : "COD"}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          ord.payment_status === "PAID" ? "text-emerald-600" : "text-amber-600"
                        }`}
                      >
                        {ord.payment_status === "PAID" ? "● Đã thanh toán" : "○ Chưa thanh toán"}
                      </span>
                    </td>
                    <td className="p-4 font-black text-shopee-orange text-sm">
                      {formatVND(ord.final_amount)}
                    </td>
                    <td className="p-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-shopee-orange ${
                          ord.status === "PENDING"
                            ? "bg-amber-50 text-amber-700 border-amber-300"
                            : ord.status === "CONFIRMED"
                            ? "bg-blue-50 text-blue-700 border-blue-300"
                            : ord.status === "SHIPPING"
                            ? "bg-purple-50 text-purple-700 border-purple-300"
                            : ord.status === "DELIVERED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                            : "bg-rose-50 text-rose-700 border-rose-300"
                        }`}
                      >
                        <option value="PENDING">Chờ Duyệt (PENDING)</option>
                        <option value="CONFIRMED">Đã Xác Nhận (CONFIRMED)</option>
                        <option value="PROCESSING">Đang Đóng Gói (PROCESSING)</option>
                        <option value="SHIPPING">Đang Vận Chuyển (SHIPPING)</option>
                        <option value="DELIVERED">Đã Giao Hàng (DELIVERED)</option>
                        <option value="CANCELLED">Hủy Đơn (CANCELLED)</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => setViewingOrder(ord)}
                        className="p-2 text-slate-600 hover:text-shopee-orange hover:bg-orange-50 rounded-xl transition"
                        title="Xem đầy đủ chi tiết đơn"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Không tìm thấy đơn hàng nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-shopee-orange" />
                  <span>Chi Tiết Đơn Hàng: {viewingOrder.order_code}</span>
                </h2>
                <p className="text-[11px] text-slate-400">Tạo lúc: {formatDate(viewingOrder.created_at)}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient & Payment Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-shopee-orange" /> Thông Tin Giao Nhận
                </span>
                <p className="font-bold text-slate-900">{viewingOrder.shipping_name} ({viewingOrder.shipping_phone})</p>
                <p className="text-slate-600">{viewingOrder.shipping_address}</p>
                {viewingOrder.note && (
                  <p className="text-[11px] text-slate-400 italic">Ghi chú: &quot;{viewingOrder.note}&quot;</p>
                )}
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-shopee-orange" /> Phương Thức & Trạng Thái
                </span>
                <p className="text-slate-700">
                  Thanh toán: <strong>{viewingOrder.payment_method === "MOCK_BANKING" ? "Mock Banking" : "COD"}</strong>
                </p>
                <p className="text-slate-700">
                  Tình trạng: <strong>{viewingOrder.payment_status}</strong>
                </p>
                <p className="text-slate-700">
                  Tiến độ: <strong className="text-shopee-orange">{viewingOrder.status}</strong>
                </p>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Sản Phẩm Trong Đơn ({viewingOrder.items.length})
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {viewingOrder.items.map((item) => (
                  <div key={item.id} className="p-3.5 flex items-center justify-between text-xs bg-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product_image_snapshot}
                        alt={item.product_name_snapshot}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{item.product_name_snapshot}</p>
                        <p className="text-slate-400">{formatVND(item.unit_price)} x {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">{formatVND(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Financials */}
            <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-100 space-y-1.5 text-xs text-right">
              <p className="text-slate-600">Tiền hàng: <strong>{formatVND(viewingOrder.total_amount)}</strong></p>
              <p className="text-slate-600">Phí ship: <strong>{formatVND(viewingOrder.shipping_fee)}</strong></p>
              {viewingOrder.discount_amount > 0 && (
                <p className="text-emerald-700">Giảm giá ({viewingOrder.coupon_code}): <strong>-{formatVND(viewingOrder.discount_amount)}</strong></p>
              )}
              <p className="text-base font-black text-shopee-orange pt-1 border-t border-orange-200">
                Tổng thanh toán: {formatVND(viewingOrder.final_amount)}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
