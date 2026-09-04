"use client";

import React from "react";
import Link from "next/link";
import { Lock, ArrowRight, UserPlus, X, ShieldAlert } from "lucide-react";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionName?: string;
  redirectUrl?: string;
}

export function AuthRequiredModal({
  isOpen,
  onClose,
  actionName = "sử dụng tính năng này",
  redirectUrl = "/",
}: AuthRequiredModalProps) {
  if (!isOpen) return null;

  const loginLink = `/login?redirect=${encodeURIComponent(redirectUrl)}`;
  const registerLink = `/register?redirect=${encodeURIComponent(redirectUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 z-10 text-center space-y-5 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Header */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
          <Lock className="w-8 h-8 stroke-[2.2]" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Xác Thực Khách Hàng
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Yêu Cầu Đăng Nhập
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
            Vui lòng đăng nhập tài khoản Khách Hàng để thực hiện{" "}
            <strong className="text-shopee-orange">{actionName}</strong> và trải nghiệm đầy đủ quyền lợi mua sắm!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <Link
            href={loginLink}
            onClick={onClose}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-shopee-orange to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>🔐 Đăng Nhập Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href={registerLink}
            onClick={onClose}
            className="w-full py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition active:scale-95 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-slate-500" />
            <span>📝 Đăng Ký Tài Khoản Mới</span>
          </Link>
        </div>

        {/* Helper Note */}
        <p className="text-[11px] text-slate-400 pt-1">
          Chỉ mất 30 giây để tạo tài khoản và nhận ngay ưu đãi 50.000 đ!
        </p>
      </div>
    </div>
  );
}
