"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  Zap,
  ArrowRight,
  ShoppingCart,
  Gift,
  CheckCircle2,
  Sparkles,
  Star,
  LogIn,
  UserPlus,
} from "lucide-react";

interface AuthPageWrapperProps {
  initialMode: "login" | "register";
}

export function AuthPageWrapper({ initialMode }: AuthPageWrapperProps) {
  const router = useRouter();
  const { login, register, demoLogin } = useAuth();

  const [mode, setMode] = useState<"login" | "register">(initialMode);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form States
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // Sync mode with props if route changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const switchMode = (newMode: "login" | "register") => {
    if (newMode === mode) return;
    setMode(newMode);
    window.history.pushState(null, "", newMode === "login" ? "/login" : "/register");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.error("Vui lòng nhập đầy đủ Email và Mật khẩu!");
      return;
    }

    setLoading(true);
    try {
      const ok = await login(loginEmail.trim(), loginPassword.trim());
      if (ok) {
        if (loginEmail.toLowerCase().includes("admin")) {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      toast.error("Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu!");
      return;
    }

    setLoading(true);
    try {
      const ok = await register(
        regName.trim(),
        regEmail.trim(),
        regPassword.trim(),
        regPhone.trim(),
        regAddress.trim()
      );
      if (ok) {
        toast.success("Tạo tài khoản thành công! Tặng bạn voucher WELCOME50K 🎉");
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: "USER" | "ADMIN") => {
    setLoading(true);
    try {
      await demoLogin(role);
      if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100/90 p-3 sm:p-5 lg:p-6 transition-colors duration-500">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px] transition-all duration-500">
        {/* Left 5 Cols: Cinematic Sliding Image Showcase Banner */}
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-7 text-white bg-slate-950 overflow-hidden">
          {/* Dual Sliding Images Track */}
          <div
            className="absolute inset-0 flex w-[200%] h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              transform: mode === "login" ? "translateX(0%)" : "translateX(-50%)",
            }}
          >
            {/* Image 1 for Login */}
            <div className="w-1/2 h-full relative overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000"
                alt="Fashion Lifestyle Login"
                className="w-full h-full object-cover object-center opacity-45 scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/40 via-slate-950/60 to-purple-900/50" />
            </div>

            {/* Image 2 for Register */}
            <div className="w-1/2 h-full relative overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000"
                alt="Shopping Mall Register"
                className="w-full h-full object-cover object-center opacity-45 scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/40 via-slate-950/60 to-rose-900/50" />
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10 space-y-1.5">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-shopee-orange to-amber-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                <ShoppingCart className="w-4 h-4 text-white stroke-[2.5]" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Mini<span className="text-amber-400">Shop</span>
              </span>
            </Link>
            <p className="text-[11px] text-slate-300">
              Nền tảng mua sắm thời trang & thương mại điện tử 2026
            </p>
          </div>

          {/* Middle Value Props Badges: Sliding Sync Track */}
          <div className="relative z-10 w-full overflow-hidden py-2">
            <div
              className="flex w-[200%] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                transform: mode === "login" ? "translateX(0%)" : "translateX(-50%)",
              }}
            >
              {/* Login Value Props Pane */}
              <div className="w-1/2 pr-3 flex-shrink-0 space-y-2.5">
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 space-y-1 shadow-lg">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Trải Nghiệm Chuẩn Hiện Đại</span>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed">
                    Tích hợp phân quyền thông minh, hệ thống thanh toán tức thì và quản lý kho hàng chuẩn Transaction.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 bg-black/30 backdrop-blur-md p-2.5 rounded-2xl border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover border border-amber-400"
                  />
                  <div className="text-left text-xs">
                    <div className="flex text-amber-400 mb-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-white font-bold text-[11px]">Hơn 10.000+ đơn hàng đã giao</p>
                    <p className="text-[10px] text-slate-400">Đánh giá trung bình 4.9/5 sao</p>
                  </div>
                </div>
              </div>

              {/* Register Value Props Pane */}
              <div className="w-1/2 pl-3 flex-shrink-0 space-y-2.5">
                <div className="bg-gradient-to-r from-shopee-orange/40 to-amber-500/40 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 space-y-1 shadow-xl">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                    <Gift className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                    <span>Quà Tặng Chào Mừng 50.000 đ</span>
                  </div>
                  <p className="text-[11px] text-slate-100 leading-relaxed">
                    Tự động áp dụng mã <strong>WELCOME50K</strong> và <strong>FREESHIP</strong> cho đơn hàng đầu tiên của bạn.
                  </p>
                </div>

                <div className="bg-black/30 backdrop-blur-md p-3 rounded-2xl border border-white/10 space-y-1.5 text-[11px] text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span>Theo dõi đơn hàng & tra cứu vận chuyển</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span>Đặt lịch hẹn thử đồ và tư vấn Showroom</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="relative z-10 text-[10px] text-slate-400 border-t border-white/10 pt-3 flex items-center justify-between">
            <span>© 2026 MiniShop Platform</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 100% Bảo mật SSL
            </span>
          </div>
        </div>

        {/* Right 7 Cols: Form Sliding Viewport */}
        <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between overflow-hidden">
          {/* Top Sliding Tab Switcher */}
          <div className="mb-4">
            <div className="bg-slate-100/90 p-1 rounded-xl flex items-center max-w-xs w-full shadow-inner border border-slate-200/60">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === "login"
                    ? "bg-white text-shopee-orange shadow-sm scale-100"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng Nhập</span>
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === "register"
                    ? "bg-white text-shopee-orange shadow-sm scale-100"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Đăng Ký</span>
              </button>
            </div>
          </div>

          {/* Smooth Sliding Flex Carousel Container */}
          <div className="relative w-full overflow-hidden flex-1 flex flex-col justify-center">
            <div
              className="flex w-[200%] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                transform: mode === "login" ? "translateX(0%)" : "translateX(-50%)",
              }}
            >
              {/* ================= Pane 1: LOGIN FORM ================= */}
              <div className="w-1/2 pr-3 flex-shrink-0 space-y-4">
                <div className="space-y-0.5">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Chào Mừng Trở Lại! 
                  </h1>
                  <p className="text-[11px] text-slate-500">
                    Nhập thông tin tài khoản để tiếp tục mua sắm
                  </p>
                </div>

                {/* Compact Inputs */}
                <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 text-xs block">Địa chỉ Email (*)</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="admin@minishop.vn hoặc user@minishop.vn"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50/90 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-shopee-orange/20 focus:border-shopee-orange focus:bg-white transition"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-700 text-xs block">Mật khẩu (*)</label>
                      <span className="text-[10px] text-slate-400">Mặc định: 123456 / admin123</span>
                    </div>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-9 py-2 bg-slate-50/90 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-shopee-orange/20 focus:border-shopee-orange focus:bg-white transition"
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-gradient-to-r from-shopee-orange to-amber-500 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-orange-500/20 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                  >
                    <span>{loading ? "Đang Đăng Nhập..." : "ĐĂNG NHẬP NGAY"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="pt-1.5 text-center text-[11px] text-slate-500 border-t border-slate-100">
                  Chưa có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    className="text-shopee-orange font-bold hover:underline cursor-pointer"
                  >
                    Đăng ký ngay &rarr;
                  </button>
                </div>
              </div>

              {/* ================= Pane 2: REGISTER FORM ================= */}
              <div className="w-1/2 pl-3 flex-shrink-0 space-y-3.5">
                <div className="space-y-0.5">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Tạo Tài Khoản Mới 
                  </h1>
                  <p className="text-[11px] text-slate-500">
                    Nhận ngay voucher 50.000 đ khi hoàn tất đăng ký
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-2.5 text-xs">
                  <div className="space-y-0.5">
                    <label className="font-bold text-slate-700 text-xs block">Họ và tên (*)</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Ví dụ: Nguyễn Văn Khách"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50/90 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-shopee-orange/20 focus:border-shopee-orange focus:bg-white transition"
                      />
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-0.5">
                      <label className="font-bold text-slate-700 text-xs block">Email (*)</label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="khachhang@minishop.vn"
                          className="w-full pl-8 pr-2 py-2 bg-slate-50/90 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-shopee-orange/20 focus:border-shopee-orange focus:bg-white transition"
                        />
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <label className="font-bold text-slate-700 text-xs block">Mật khẩu (*)</label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? "text" : "password"}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="≥ 6 ký tự"
                          className="w-full pl-8 pr-8 py-2 bg-slate-50/90 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-shopee-orange/20 focus:border-shopee-orange focus:bg-white transition"
                        />
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-0.5">
                      <label className="font-bold text-slate-700 text-xs block">Số điện thoại</label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="0987654321"
                          className="w-full pl-8 pr-2 py-2 bg-slate-50/90 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-shopee-orange/20 focus:border-shopee-orange focus:bg-white transition"
                        />
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <label className="font-bold text-slate-700 text-xs block">Địa chỉ</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={regAddress}
                          onChange={(e) => setRegAddress(e.target.value)}
                          placeholder="123 Nguyễn Trãi, Q.5"
                          className="w-full pl-8 pr-2 py-2 bg-slate-50/90 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-shopee-orange/20 focus:border-shopee-orange focus:bg-white transition"
                        />
                        <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-gradient-to-r from-shopee-orange to-amber-500 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-orange-500/20 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                  >
                    <span>{loading ? "Đang Tạo Tài Khoản..." : "HOÀN TẤT ĐĂNG KÝ"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="pt-1.5 text-center text-[11px] text-slate-500 border-t border-slate-100">
                  Đã có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="text-shopee-orange font-bold hover:underline cursor-pointer"
                  >
                    Đăng nhập ngay &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
