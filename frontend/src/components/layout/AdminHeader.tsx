"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Store, ShieldCheck, LogOut, ChevronDown, Menu } from "lucide-react";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { toast } from "sonner";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menuRef = React.useRef<HTMLDivElement>(null);

  const adminName =
    user?.role === "ADMIN" ? user.name || "Quản Văn Lý" : "Quản Văn Lý";

  const adminEmail =
    user?.role === "ADMIN"
      ? user.email || "admin@minishop.vn"
      : "admin@minishop.vn";

  const adminAvatar =
    user?.role === "ADMIN" && user.avatar_url
      ? user.avatar_url
      : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200";

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
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
      <header className="sticky top-0 z-40 flex h-16 w-full min-w-0 shrink-0 items-center justify-between border-b border-slate-200 bg-white/98 px-3 shadow-sm backdrop-blur-md sm:px-6">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {/* Mobile menu button: luôn tồn tại dưới md */}
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Mở menu quản trị"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 active:scale-95 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <span className="flex min-w-0 items-center gap-1.5 rounded-md border border-purple-200 bg-purple-50 px-2 py-1 text-[11px] font-bold text-purple-700 sm:px-2.5 sm:text-xs">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">ADMIN PORTAL</span>
          </span>

          <span className="hidden text-slate-300 sm:inline">|</span>

          <span className="hidden text-xs text-slate-500 md:inline">
            Chào mừng{" "}
            <strong className="text-slate-800">{adminName}</strong>
          </span>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-2.5 py-2 text-xs font-bold text-shopee-orange transition hover:bg-orange-100 sm:px-3.5"
            title="Xem giao diện khách hàng"
          >
            <Store className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">Xem Cửa Hàng</span>
          </Link>

          <div
            ref={menuRef}
            className="relative border-l border-slate-200 pl-2"
            onMouseEnter={() => setIsProfileMenuOpen(true)}
            onMouseLeave={() => setIsProfileMenuOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="flex cursor-pointer items-center gap-2.5 rounded-2xl p-1.5 transition hover:bg-slate-100"
              aria-label="Mở menu tài khoản admin"
            >
              <img
                src={adminAvatar}
                alt="Admin"
                className="h-8 w-8 rounded-full border-2 border-purple-300 object-cover shadow-sm"
              />

              <div className="hidden text-left md:block">
                <p className="flex items-center gap-1 text-xs font-bold leading-tight text-slate-800">
                  <span>{adminName}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </p>
                <p className="text-[10px] font-semibold text-purple-600">
                  Super Administrator
                </p>
              </div>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full z-50 w-64 pt-2 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl">
                  <div className="mb-1 rounded-xl border-b border-slate-100 bg-slate-50/80 px-3.5 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                      <p className="truncate text-xs font-black text-slate-900">
                        {adminName}
                      </p>
                    </div>

                    <p className="mt-0.5 truncate text-[11px] text-slate-400">
                      {adminEmail}
                    </p>

                    <span className="mt-1 inline-block rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                      Quyền hạn: ADMIN
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => setIsLogoutModalOpen(true)}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-xs font-bold text-rose-600 transition hover:bg-rose-50 active:scale-95"
                    >
                      <LogOut className="h-4 w-4 text-rose-500" />
                      <span>Đăng Xuất Khỏi Admin</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

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
