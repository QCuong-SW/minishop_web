"use client";

import React, { useEffect, useState } from "react";
import { getMiniShopChangedKey, MINISHOP_DATA_CHANGE_EVENT, StorageService } from "@/lib/storage";
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const STATUS_OPTIONS: { id: string; label: string }[] = [
  { id: "ALL", label: "Tất Cả" },
  { id: "PENDING", label: "Chờ Duyệt" },
  { id: "CONFIRMED", label: "Đã Xác Nhận" },
  { id: "SHIPPING", label: "Đang Giao" },
  { id: "DELIVERED", label: "Đã Giao" },
  { id: "CANCELLED", label: "Đã Hủy" },
];

const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "Chờ Duyệt" },
  { value: "CONFIRMED", label: "Đã Xác Nhận" },
  { value: "PROCESSING", label: "Đang Đóng Gói" },
  { value: "SHIPPING", label: "Đang Vận Chuyển" },
  { value: "DELIVERED", label: "Đã Giao Hàng" },
  { value: "CANCELLED", label: "Hủy Đơn" },
];

function statusClass(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-300";
    case "CONFIRMED":
      return "bg-blue-50 text-blue-700 border-blue-300";
    case "PROCESSING":
      return "bg-cyan-50 text-cyan-700 border-cyan-300";
    case "SHIPPING":
      return "bg-purple-50 text-purple-700 border-purple-300";
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-700 border-emerald-300";
    default:
      return "bg-rose-50 text-rose-700 border-rose-300";
  }
}

function statusLabel(status: OrderStatus) {
  return ORDER_STATUS_OPTIONS.find((item) => item.value === status)?.label ?? status;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [keyword, setKeyword] = useState("");
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const fetchOrders = () => {
    StorageService.init();
    const list = StorageService.getOrders();
    setOrders(list);
  };

  useEffect(() => {
    fetchOrders();

    const refreshOrders = (event: Event) => {
      const key = getMiniShopChangedKey(event);
      if (key.includes("orders")) {
        fetchOrders();
      }
    };
    window.addEventListener(MINISHOP_DATA_CHANGE_EVENT, refreshOrders);
    window.addEventListener("storage", refreshOrders);
    return () => {
      window.removeEventListener(MINISHOP_DATA_CHANGE_EVENT, refreshOrders);
      window.removeEventListener("storage", refreshOrders);
    };
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-xl font-black text-slate-900 sm:text-2xl">
          <ShoppingBag className="h-5 w-5 shrink-0 text-shopee-orange sm:h-6 sm:w-6" />
          <span>Quản Lý & Duyệt Đơn Hàng</span>
        </h1>
        <p className="mt-1 max-w-2xl text-[11px] leading-5 text-slate-500 sm:text-xs">
          Theo dõi luồng xử lý đơn hàng từ lúc đặt cho đến khi shipper giao thành công
        </p>
      </div>

      {/* Filter & Search */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm sm:p-4">
        <div className="-mx-1 overflow-x-auto px-1 pb-2 scrollbar-none">
          <div className="flex min-w-max gap-1.5 text-xs font-bold">
            {STATUS_OPTIONS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`whitespace-nowrap rounded-xl px-3 py-2 transition ${
                  statusFilter === tab.id
                    ? "bg-shopee-orange text-white shadow"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-2 w-full sm:mt-3 sm:max-w-md">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo Mã đơn, Tên, SĐT..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-shopee-orange"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Mobile Order Cards */}
      <div className="space-y-3 md:hidden">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((ord) => {
            const expanded = expandedOrderId === ord.id;

            return (
              <article
                key={ord.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-sm font-black text-slate-900">
                        {ord.order_code}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {formatDate(ord.created_at)}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusClass(
                        ord.status
                      )}`}
                    >
                      {statusLabel(ord.status)}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Tổng tiền
                      </p>
                      <p className="mt-1 text-sm font-black text-shopee-orange">
                        {formatVND(ord.final_amount)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Thanh toán
                      </p>
                      <p className="mt-1 text-xs font-bold text-slate-800">
                        {ord.payment_method === "MOCK_BANKING" ? "Ngân hàng mô phỏng" : "COD"}
                      </p>
                      <p
                        className={`mt-0.5 text-[10px] font-bold ${
                          ord.payment_status === "PAID"
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }`}
                      >
                        {ord.payment_status === "PAID"
                          ? "● Đã thanh toán"
                          : "○ Chưa thanh toán"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedOrderId(expanded ? null : ord.id)
                      }
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                    >
                      {expanded ? (
                        <>
                          Thu gọn <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Xem nhanh <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setViewingOrder(ord)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
                    >
                      <Eye className="h-4 w-4" />
                      Chi tiết
                    </button>
                  </div>
                </div>

                {expanded && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-4">
                    <div className="space-y-3 text-xs">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Khách hàng
                        </p>
                        <p className="mt-1 font-bold text-slate-900">
                          {ord.shipping_name}
                        </p>
                        <p className="text-slate-500">{ord.shipping_phone}</p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Đổi trạng thái
                        </p>
                        <select
                          value={ord.status}
                          onChange={(e) =>
                            handleStatusChange(
                              ord.id,
                              e.target.value as OrderStatus
                            )
                          }
                          className={`mt-1.5 w-full rounded-xl border px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-shopee-orange ${statusClass(
                            ord.status
                          )}`}
                        >
                          {ORDER_STATUS_OPTIONS.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label} ({item.value})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400 shadow-sm">
            Không tìm thấy đơn hàng nào phù hợp.
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase tracking-wider text-slate-500">
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
                  <tr
                    key={ord.id}
                    className="transition hover:bg-slate-50/50"
                  >
                    <td className="p-4 font-mono text-sm font-bold text-slate-900">
                      {ord.order_code}
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-900">
                        {ord.shipping_name}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        {ord.shipping_phone}
                      </span>
                    </td>

                    <td className="p-4 text-slate-500">
                      {formatDate(ord.created_at)}
                    </td>

                    <td className="p-4">
                      <span className="block font-semibold text-slate-800">
                        {ord.payment_method === "MOCK_BANKING"
                          ? "Ngân hàng mô phỏng"
                          : "COD"}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          ord.payment_status === "PAID"
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }`}
                      >
                        {ord.payment_status === "PAID"
                          ? "● Đã thanh toán"
                          : "○ Chưa thanh toán"}
                      </span>
                    </td>

                    <td className="p-4 text-sm font-black text-shopee-orange">
                      {formatVND(ord.final_amount)}
                    </td>

                    <td className="p-4">
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          handleStatusChange(
                            ord.id,
                            e.target.value as OrderStatus
                          )
                        }
                        className={`rounded-xl border px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-shopee-orange ${statusClass(
                          ord.status
                        )}`}
                      >
                        {ORDER_STATUS_OPTIONS.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label} ({item.value})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => setViewingOrder(ord)}
                        className="rounded-xl p-2 text-slate-600 transition hover:bg-orange-50 hover:text-shopee-orange"
                        title="Xem đầy đủ chi tiết đơn"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-slate-400"
                  >
                    Không tìm thấy đơn hàng nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {viewingOrder && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setViewingOrder(null)}
        >
          <div
            className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-slate-100 bg-white p-4 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-5 flex items-start justify-between border-b border-slate-100 bg-white px-4 py-4 sm:-mx-6 sm:-mt-6 sm:px-6">
              <div className="min-w-0 pr-3">
                <h2 className="flex items-center gap-2 text-sm font-black text-slate-900 sm:text-base">
                  <ShoppingBag className="h-5 w-5 shrink-0 text-shopee-orange" />
                  <span className="truncate">
                    Chi Tiết Đơn Hàng: {viewingOrder.order_code}
                  </span>
                </h2>
                <p className="mt-1 text-[10px] text-slate-400 sm:text-[11px]">
                  Tạo lúc: {formatDate(viewingOrder.created_at)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Recipient & Payment Summary */}
              <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 sm:gap-4">
                <div className="space-y-1.5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <span className="flex items-center gap-1 font-bold text-slate-700">
                    <MapPin className="h-3.5 w-3.5 text-shopee-orange" />
                    Thông Tin Giao Nhận
                  </span>
                  <p className="font-bold text-slate-900">
                    {viewingOrder.shipping_name}
                  </p>
                  <p className="text-slate-600">{viewingOrder.shipping_phone}</p>
                  <p className="break-words text-slate-600">
                    {viewingOrder.shipping_address}
                  </p>
                  {viewingOrder.note && (
                    <p className="text-[11px] italic text-slate-400">
                      Ghi chú: &quot;{viewingOrder.note}&quot;
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <span className="flex items-center gap-1 font-bold text-slate-700">
                    <CreditCard className="h-3.5 w-3.5 text-shopee-orange" />
                    Phương Thức & Trạng Thái
                  </span>
                  <p className="text-slate-700">
                    Thanh toán:{" "}
                    <strong>
                      {viewingOrder.payment_method === "MOCK_BANKING"
                        ? "Ngân hàng mô phỏng"
                        : "COD"}
                    </strong>
                  </p>
                  <p className="text-slate-700">
                    Tình trạng: <strong>{viewingOrder.payment_status}</strong>
                  </p>
                  <p className="text-slate-700">
                    Tiến độ:{" "}
                    <strong className="text-shopee-orange">
                      {viewingOrder.status}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Sản Phẩm Trong Đơn ({viewingOrder.items.length})
                </h3>

                <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200">
                  {viewingOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-white p-3 text-xs sm:p-3.5"
                    >
                      <img
                        src={item.product_image_snapshot}
                        alt={item.product_name_snapshot}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600";
                        }}
                        className="h-12 w-12 shrink-0 rounded-xl border border-slate-200 object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 font-bold text-slate-900">
                          {item.product_name_snapshot}
                        </p>
                        <p className="mt-1 text-slate-400">
                          {formatVND(item.unit_price)} × {item.quantity}
                        </p>
                      </div>

                      <span className="shrink-0 font-bold text-slate-900">
                        {formatVND(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1.5 rounded-2xl border border-orange-100 bg-orange-50/60 p-4 text-right text-xs">
                <p className="text-slate-600">
                  Tiền hàng:{" "}
                  <strong>{formatVND(viewingOrder.total_amount)}</strong>
                </p>
                <p className="text-slate-600">
                  Phí ship:{" "}
                  <strong>{formatVND(viewingOrder.shipping_fee)}</strong>
                </p>

                {viewingOrder.discount_amount > 0 && (
                  <p className="text-emerald-700">
                    Giảm giá ({viewingOrder.coupon_code}):{" "}
                    <strong>
                      -{formatVND(viewingOrder.discount_amount)}
                    </strong>
                  </p>
                )}

                <p className="border-t border-orange-200 pt-2 text-base font-black text-shopee-orange">
                  Tổng thanh toán: {formatVND(viewingOrder.final_amount)}
                </p>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setViewingOrder(null)}
                  className="w-full rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 sm:w-auto"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
