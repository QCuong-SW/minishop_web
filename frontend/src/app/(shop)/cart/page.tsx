"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { QuantityPicker } from "@/components/shared/QuantityPicker";
import { useCart } from "@/context/CartContext";
import { formatVND } from "@/lib/utils";
import {
  Trash2,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Ticket,
  ChevronRight,
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    selectedCount,
    totalAmount,
    updateQuantity,
    removeFromCart,
    toggleSelection,
    toggleSelectAll,
    clearCart,
  } = useCart();

  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isClearAllOpen, setIsClearAllOpen] = useState(false);

  const allSelected = cart.length > 0 && cart.every((item) => item.selected !== false);
  const isAnySelected = cart.some((item) => item.selected !== false);

  const handleCheckout = () => {
    if (!isAnySelected) return;
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-shopee-orange">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800">Giỏ Hàng Của Bạn</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-orange-50 text-shopee-orange rounded-2xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900">
                Giỏ Hàng ({cart.length} sản phẩm)
              </h1>
              <p className="text-xs text-slate-500">Kiểm tra số lượng và tiến hành đặt hàng</p>
            </div>
          </div>

          {cart.length > 0 && (
            <button
              type="button"
              onClick={() => setIsClearAllOpen(true)}
              className="text-xs font-bold text-rose-500 hover:text-rose-700 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa tất cả
            </button>
          )}
        </div>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left 2 Cols: Cart Table */}
            <div className="lg:col-span-2 space-y-4">
              {/* Select All Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between text-xs font-bold text-slate-700">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded text-shopee-orange focus:ring-shopee-orange accent-shopee-orange"
                  />
                  <span>Chọn tất cả ({cart.length} món)</span>
                </label>
                <span className="text-slate-400 font-normal">Đã chọn {selectedCount} món</span>
              </div>

              {/* Items List */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
                {cart.map((item) => (
                  <div
                    key={item.product_id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={item.selected !== false}
                        onChange={() => toggleSelection(item.product_id)}
                        className="w-4 h-4 rounded text-shopee-orange focus:ring-shopee-orange accent-shopee-orange flex-shrink-0"
                      />

                      <Link
                        href={`/products/${item.slug}`}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0"
                      >
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      <div className="space-y-1 min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-bold text-slate-900 text-xs sm:text-sm hover:text-shopee-orange transition line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs sm:text-sm font-black text-shopee-orange">
                            {formatVND(item.price)}
                          </span>
                          {item.original_price && item.original_price > item.price && (
                            <span className="text-[10px] text-slate-400 line-through">
                              {formatVND(item.original_price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Subtotal */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 self-end sm:self-center pl-7 sm:pl-0">
                      <QuantityPicker
                        quantity={item.quantity}
                        maxStock={item.stock}
                        onChange={(qty) => updateQuantity(item.product_id, qty)}
                        size="sm"
                      />

                      <div className="text-right min-w-[90px]">
                        <span className="text-xs sm:text-sm font-black text-slate-900 block">
                          {formatVND(item.subtotal)}
                        </span>
                        <span className="text-[10px] text-slate-400">Thành tiền</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setItemToDelete(item.product_id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition"
                        title="Xóa món này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 1 Col: Sticky Order Summary */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6 sticky top-24">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Tóm Tắt Đơn Hàng
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Số lượng món chọn:</span>
                  <span className="font-bold text-slate-900">{selectedCount} sản phẩm</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính tiền hàng:</span>
                  <span className="font-bold text-slate-900">{formatVND(totalAmount)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Phí vận chuyển:</span>
                  <span className="font-bold text-emerald-600">
                    {totalAmount >= 200000 ? "Miễn phí" : "+30.000 đ"}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-sm">Tổng thanh toán:</span>
                  <span className="text-xl font-black text-shopee-orange">
                    {formatVND(totalAmount + (totalAmount >= 200000 || totalAmount === 0 ? 0 : 30000))}
                  </span>
                </div>

                <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-100 text-[11px] text-orange-800 flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-shopee-orange flex-shrink-0" />
                  <span>Mã giảm giá (Coupon) sẽ được áp dụng tại bước Thanh toán!</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={!isAnySelected}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-shopee-orange to-amber-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              >
                <span>Tiến Hành Đặt Hàng</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <Link
                  href="/products"
                  className="text-xs font-semibold text-slate-500 hover:text-shopee-orange transition"
                >
                  &larr; Tiếp tục tìm kiếm sản phẩm khác
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            title="Giỏ hàng của bạn đang trống"
            description="Bạn chưa chọn món đồ nào vào giỏ hàng. Hãy khám phá ngay các sản phẩm hot đang giảm giá hôm nay nhé!"
            actionText="Mua sắm ngay bây giờ"
            actionHref="/products"
          />
        )}
      </main>

      {/* Single Item Delete Modal */}
      <ConfirmModal
        isOpen={itemToDelete !== null}
        title="Xóa sản phẩm khỏi giỏ hàng?"
        message="Bạn có chắc chắn muốn bỏ món hàng này ra khỏi giỏ mua sắm?"
        confirmText="Xóa bỏ"
        onConfirm={() => {
          if (itemToDelete !== null) {
            removeFromCart(itemToDelete);
            setItemToDelete(null);
          }
        }}
        onCancel={() => setItemToDelete(null)}
      />

      {/* Clear All Modal */}
      <ConfirmModal
        isOpen={isClearAllOpen}
        title="Xóa toàn bộ giỏ hàng?"
        message="Hành động này sẽ làm trống tất cả các sản phẩm đang có trong giỏ của bạn."
        confirmText="Làm trống giỏ"
        onConfirm={() => {
          clearCart();
          setIsClearAllOpen(false);
        }}
        onCancel={() => setIsClearAllOpen(false)}
      />

      <Footer />
    </div>
  );
}
