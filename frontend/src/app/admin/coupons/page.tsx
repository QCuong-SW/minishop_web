"use client";

import React, { useEffect, useState } from "react";
import { StorageService } from "@/lib/storage";
import { Coupon, DiscountType } from "@/types";
import { formatVND, formatDateOnly } from "@/lib/utils";
import { toast } from "sonner";
import {
  Ticket,
  Plus,
  X,
  Calendar,
  Percent,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Form Fields
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("FIXED");
  const [discountValue, setDiscountValue] = useState<number | string>(50000);
  const [minOrderAmount, setMinOrderAmount] = useState<number | string>(200000);
  const [maxDiscount, setMaxDiscount] = useState<number | string>("");
  const [expiresAt, setExpiresAt] = useState("2026-12-31");
  const [usageLimit, setUsageLimit] = useState<number | string>(500);

  const fetchCoupons = () => {
    StorageService.init();
    setCoupons(StorageService.getCoupons());
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenAdd = () => {
    setCode("");
    setDescription("");
    setDiscountType("FIXED");
    setDiscountValue(50000);
    setMinOrderAmount(200000);
    setMaxDiscount("");
    setExpiresAt("2026-12-31");
    setUsageLimit(500);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() || !discountValue) {
      toast.error("Vui lòng nhập Mã khuyến mãi và Giá trị giảm!");
      return;
    }

    try {
      StorageService.saveCoupon({
        code: code.trim().toUpperCase(),
        description: description.trim(),
        discount_type: discountType,
        discount_value: Number(discountValue),
        min_order_amount: Number(minOrderAmount) || 0,
        max_discount: maxDiscount ? Number(maxDiscount) : null,
        expires_at: `${expiresAt} 23:59:59`,
        usage_limit: Number(usageLimit) || 100,
      });

      toast.success(
        `Đã tạo mã giảm giá "${code.toUpperCase()}" thành công! 🎟️`
      );

      setIsModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      toast.error(err.message || "Lỗi tạo coupon");
    }
  };

  const formatDiscount = (coupon: Coupon) =>
    coupon.discount_type === "FIXED"
      ? formatVND(coupon.discount_value)
      : `${coupon.discount_value}%`;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black text-slate-900 sm:text-2xl sm:gap-2.5">
            <Ticket className="h-5 w-5 shrink-0 text-shopee-orange sm:h-6 sm:w-6" />
            <span>Quản lý mã giảm giá</span>
          </h1>

          <p className="mt-1 text-[11px] leading-5 text-slate-500 sm:text-xs">
            Tạo các mã khuyến mãi giảm tiền cố định hoặc giảm theo % kích thích mua sắm
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex w-fit items-center gap-2 self-start rounded-xl bg-shopee-orange px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-shopee-hover active:scale-95 sm:self-auto sm:px-5"
        >
          <Plus className="h-4 w-4" />
          Tạo Mã Giảm Giá
        </button>
      </div>

      {/* Mobile Coupon Cards */}
      <div className="space-y-3 md:hidden">
        {coupons.map((c) => {
          const expanded = expandedId === c.id;

          return (
            <article
              key={c.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="inline-flex rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-1 font-mono text-xs font-black text-shopee-orange">
                      {c.code}
                    </span>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">
                      {c.description || "Chưa có mô tả khuyến mãi."}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                    Kích Hoạt
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Giá trị giảm
                    </p>
                    <p className="mt-1 text-sm font-black text-emerald-700">
                      {formatDiscount(c)}
                    </p>
                    {c.max_discount && (
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Tối đa {formatVND(c.max_discount)}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Hết hạn
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-800">
                      <Calendar className="h-3.5 w-3.5 text-shopee-orange" />
                      {formatDateOnly(c.expires_at)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : c.id)}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  {expanded ? (
                    <>
                      Thu gọn <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Xem thêm <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              {expanded && (
                <div className="border-t border-slate-100 bg-slate-50/60 p-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Đơn tối thiểu
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {formatVND(c.min_order_amount)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Lượt dùng
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {c.used_count} / {c.usage_limit}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Loại giảm
                    </p>
                    <p className="mt-1 font-bold text-slate-700">
                      {c.discount_type === "FIXED"
                        ? "Giảm số tiền cố định"
                        : "Giảm theo phần trăm"}
                    </p>
                  </div>

                  {c.max_discount && (
                    <div className="mt-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Mức giảm tối đa
                      </p>
                      <p className="mt-1 font-bold text-slate-700">
                        {formatVND(c.max_discount)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase tracking-wider text-slate-500">
                <th className="p-4">Mã Code</th>
                <th className="p-4">Mô Tả Khuyến Mãi</th>
                <th className="p-4">Loại & Giá Trị Giảm</th>
                <th className="p-4">Đơn Tối Thiểu</th>
                <th className="p-4">Lượt Dùng / Giới Hạn</th>
                <th className="p-4">Ngày Hết Hạn</th>
                <th className="p-4">Trạng Thái</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {coupons.map((c) => (
                <tr key={c.id} className="transition hover:bg-slate-50/50">
                  <td className="p-4">
                    <span className="rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-1 font-mono text-xs font-black text-shopee-orange">
                      {c.code}
                    </span>
                  </td>

                  <td className="max-w-xs p-4 font-medium text-slate-800">
                    {c.description}
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-emerald-700">
                      {formatDiscount(c)}
                    </span>

                    {c.max_discount && (
                      <span className="block text-[10px] text-slate-400">
                        Tối đa {formatVND(c.max_discount)}
                      </span>
                    )}
                  </td>

                  <td className="p-4 font-semibold text-slate-700">
                    {formatVND(c.min_order_amount)}
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-slate-800">
                      {c.used_count} / {c.usage_limit}
                    </span>
                  </td>

                  <td className="p-4 text-slate-500">
                    {formatDateOnly(c.expires_at)}
                  </td>

                  <td className="p-4">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                      Kích Hoạt
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Coupon Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-slate-100 bg-white p-4 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-5 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-4 sm:-mx-6 sm:-mt-6 sm:px-6">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                <Ticket className="h-5 w-5 text-shopee-orange" />
                <span>Tạo Mã Khuyến Mãi Mới</span>
              </h2>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Mã Code (*)
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="VÍ DỤ: SALE50K, FREESHIP..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono font-bold uppercase text-shopee-orange focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Mô tả hiển thị
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Giảm ngay 50k cho đơn từ 200k..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Loại giảm (*)
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) =>
                      setDiscountType(e.target.value as DiscountType)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                  >
                    <option value="FIXED">Số tiền cố định (VNĐ)</option>
                    <option value="PERCENT">Phần trăm (%)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Giá trị giảm ({discountType === "FIXED" ? "VNĐ" : "%"}) (*)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Đơn tối thiểu (VNĐ)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Giới hạn số lượt dùng
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                  />
                </div>
              </div>

              {discountType === "PERCENT" && (
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Mức giảm tối đa (VNĐ)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    placeholder="Ví dụ: 100000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Ngày hết hạn (*)
                </label>
                <input
                  type="date"
                  required
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                />
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-shopee-orange px-6 py-2.5 text-xs font-bold text-white shadow transition hover:bg-shopee-hover active:scale-95 sm:w-auto"
                >
                  Tạo mã giảm giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
