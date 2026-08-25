"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Store, ShieldCheck, LogOut, ChevronDown } from "lucide-react";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { toast } from "sonner";

export function AdminHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const adminName = user?.role === "ADMIN" ? (user.name || "Quản Văn Lý") : "Quản Văn Lý";
  const adminEmail = user?.role === "ADMIN" ? (user.email || "admin@minishop.vn") : "admin@minishop.vn";
  const adminAvatar = user?.role === "ADMIN" && user.avatar_url ? user.avatar_url : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200";

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    setIsProfileMenuOpen(false);
    logout();
    toast.success("Đã đăng xuất khỏi tài khoản Quản trị viên!");
    router.push("/login");
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> HỆ THỐNG QUẢN TRỊ ADMIN
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Chào mừng <strong className="text-slate-800">{adminName}</strong>
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

          {/* Admin Profile Dropdown with Seamless Hover Bridge & Click Support */}
          <div
            ref={menuRef}
            className="relative pl-2 border-l border-slate-200"
            onMouseEnter={() => setIsProfileMenuOpen(true)}
            onMouseLeave={() => setIsProfileMenuOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-100 transition cursor-pointer"
            >
              <img
                src={adminAvatar}
                alt="Admin"
                className="w-8 h-8 rounded-full object-cover border-2 border-purple-300 shadow-sm"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                  <span>{adminName}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </p>
                <p className="text-[10px] text-purple-600 font-semibold">Super Administrator</p>
              </div>
            </button>

            {/* Dropdown with Invisible Bridge to prevent closing on mouse move */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full pt-2 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-2">
                  <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/80 rounded-xl mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-xs font-black text-slate-900 truncate">{adminName}</p>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{adminEmail}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      Quyền hạn: ADMIN
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => setIsLogoutModalOpen(true)}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition active:scale-95 text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Đăng Xuất Khỏi Admin</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Confirmation Modal on Logout */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Xác Nhận Đăng Xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản Quản trị viên (Quản Văn Lý) không?"
        confirmText="Đăng Xuất"
        cancelText="Ở Lại"
        variant="danger"
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
}
