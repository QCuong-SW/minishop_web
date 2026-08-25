"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, ArrowLeft, LogIn, Lock } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAdmin, isAuthenticated } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [user]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-shopee-orange border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-xs font-bold">Đang kiểm tra quyền quản trị...</p>
        </div>
      </div>
    );
  }

  // Strict check: Must be authenticated AND have role === "ADMIN"
  if (!isAuthenticated || !user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-black tracking-widest text-rose-400 uppercase bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              403 FORBIDDEN — TRUY CẬP BỊ TỪ CHỐI
            </span>
            <h1 className="text-xl font-black text-white">
              Phân Hệ Dành Riêng Cho Quản Trị Viên
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tài khoản của bạn ({user ? `${user.name} (${user.role})` : "Khách chưa đăng nhập"}) không có quyền truy cập vào Phân hệ Admin Portal.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-left text-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Yêu cầu đăng nhập Admin:</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Vui lòng đăng nhập bằng tài khoản <strong>Quản Văn Lý (admin@minishop.vn)</strong> để tiếp tục.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/login"
              className="flex-1 py-3 px-4 bg-shopee-orange hover:bg-shopee-hover text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Đăng Nhập Admin
            </Link>
            <Link
              href="/"
              className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl transition active:scale-95 flex items-center justify-center gap-2 border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" /> Về Mua Sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
