"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Store, Bell, ShieldCheck } from "lucide-react";

export function AdminHeader() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> HỆ THỐNG QUẢN TRỊ ADMIN
        </span>
        <span className="text-slate-300">|</span>
        <span className="text-xs text-slate-500 hidden sm:inline">
          Chào mừng <strong className="text-slate-800">{user?.name || "Admin"}</strong>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-bold text-shopee-orange bg-orange-50 hover:bg-orange-100 px-3.5 py-2 rounded-xl transition border border-orange-200"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Xem Giao Diện Khách Hàng</span>
        </Link>

        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <img
            src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}
            alt="Admin"
            className="w-8 h-8 rounded-full object-cover border border-purple-300"
          />
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || "Admin"}</p>
            <p className="text-[10px] text-purple-600 font-semibold">Super Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
