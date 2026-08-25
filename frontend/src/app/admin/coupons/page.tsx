"use client";

import React, { useState, useEffect } from "react";
import { StorageService } from "@/lib/storage";
import { Coupon, DiscountType } from "@/types";
import { formatVND, formatDateOnly } from "@/lib/utils";
import { toast } from "sonner";
import {
  Ticket,
  Plus,
  X,
  CheckCircle2,
  Calendar,
  Percent,
} from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      toast.success(`Đã tạo mã giảm giá "${code.toUpperCase()}" thành công! 🎟️`);
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      toast.error(err.message || "Lỗi tạo coupon");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Ticket className="w-6 h-6 text-shopee-orange" />
            <span>Quản Lý Mã Giảm Giá (Coupons)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tạo các mã khuyến mãi giảm tiền cố định hoặc giảm theo % kích thích mua sắm
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-shopee-orange text-white font-bold text-xs rounded-xl shadow-md hover:bg-shopee-hover flex items-center gap-2 transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Tạo Mã Giảm Giá
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
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
                <tr key={c.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <span className="font-mono font-black text-shopee-orange bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 text-xs">
                      {c.code}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-800 max-w-xs">{c.description}</td>
                  <td className="p-4">
                    <span className="font-bold text-emerald-700">
                      {c.discount_type === "FIXED" ? formatVND(c.discount_value) : `${c.discount_value}%`}
                    </span>
                    {c.max_discount && (
                      <span className="text-[10px] text-slate-400 block">
                        Tối đa {formatVND(c.max_discount)}
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-semibold text-slate-700">{formatVND(c.min_order_amount)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">
                        {c.used_count} / {c.usage_limit}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500">{formatDateOnly(c.expires_at)}</td>
                  <td className="p-4">
                    <span className="font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-shopee-orange" />
                <span>Tạo Mã Khuyến Mãi Mới</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Mã Code (*)</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="VÍ DỤ: SALE50K, FREESHIP..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange font-mono font-bold uppercase text-shopee-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Mô tả hiển thị</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Giảm ngay 50k cho đơn từ 200k..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Loại giảm (*)</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange font-bold"
                  >
                    <option value="FIXED">Số tiền cố định (VNĐ)</option>
                    <option value="PERCENT">Phần trăm (%)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    Giá trị giảm ({discountType === "FIXED" ? "VNĐ" : "%"}) (*)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Đơn tối thiểu (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Giới hạn số lượt dùng</label>
                  <input
                    type="number"
                    min={1}
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Ngày hết hạn (*)</label>
                <input
                  type="date"
                  required
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange font-bold text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-shopee-orange text-white font-bold text-xs rounded-xl shadow hover:bg-shopee-hover transition active:scale-95"
                >
                  Tạo Mã Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
