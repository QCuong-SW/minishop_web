"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState("user@shopee.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Vui lòng nhập đầy đủ Email và Mật khẩu!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const ok = login(email.trim());
      setLoading(false);
      if (ok) {
        router.push("/");
      }
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-100 via-orange-50/40 to-slate-100 p-4">
      {/* Brand Header */}
      <div className="text-center mb-8 space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-shopee-orange to-amber-500 flex items-center justify-center text-white text-lg shadow-lg group-hover:scale-105 transition-transform">
            🛒
          </div>
          <span className="text-3xl font-black text-shopee-orange tracking-tight">
            Shopee<span className="text-slate-800">Mini</span>
          </span>
        </Link>
        <p className="text-xs text-slate-500 font-medium">
          Hệ thống Đăng Nhập Tài Khoản Mua Sắm & Quản Trị
        </p>
      </div>

      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200/80 space-y-6">
        <div>
          <h1 className="text-xl font-black text-slate-900">Đăng Nhập</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Nhập email và mật khẩu của bạn để tiếp tục
          </p>
        </div>

        {/* Demo Fast Logins Section (Essential for Presentations) */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-2xl border border-orange-200/80 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-800">
            <Sparkles className="w-3.5 h-3.5 text-shopee-orange" />
            <span>Chức Năng Dành Riêng Cho Demo Báo Cáo:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => demoLogin("USER")}
              className="py-2.5 px-3 bg-shopee-orange hover:bg-shopee-hover text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" /> 1-Click User
            </button>
            <button
              type="button"
              onClick={() => demoLogin("ADMIN")}
              className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" /> 1-Click Admin
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Địa chỉ Email (*)</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@shopee.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange focus:bg-white transition"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Mật khẩu (*)</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange focus:bg-white transition"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-shopee-orange to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-orange-500/20 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{loading ? "Đang Đăng Nhập..." : "ĐĂNG NHẬP"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-shopee-orange font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
