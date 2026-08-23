"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Ticket,
  Calendar,
  Users,
  Store,
  LogOut,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { StorageService } from "@/lib/storage";
import { toast } from "sonner";

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    { href: "/admin", label: "Tổng Quan (Dashboard)", icon: LayoutDashboard },
    { href: "/admin/products", label: "Quản Lý Sản Phẩm", icon: Package },
    { href: "/admin/categories", label: "Quản Lý Danh Mục", icon: Layers },
    { href: "/admin/orders", label: "Quản Lý Đơn Hàng", icon: ShoppingBag },
    { href: "/admin/coupons", label: "Mã Giảm Giá (Coupons)", icon: Ticket },
    { href: "/admin/appointments", label: "Lịch Hẹn Showroom", icon: Calendar },
    { href: "/admin/users", label: "Khách Hàng & Quyền", icon: Users },
  ];

  const handleResetData = () => {
    StorageService.resetToSeed();
    toast.success("Đã khôi phục toàn bộ dữ liệu mẫu (Seed Data) thành công! 🔄");
    window.location.reload();
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between p-4 border-r border-slate-800 flex-shrink-0">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-shopee-orange to-amber-500 flex items-center justify-center text-white font-bold shadow-md">
            🛡️
          </div>
          <div>
            <h2 className="font-black text-white text-base leading-tight tracking-tight">
              Shopee<span className="text-shopee-orange">Admin</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Control Panel
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? "bg-shopee-orange text-white font-bold shadow-md shadow-orange-950"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
        <button
          type="button"
          onClick={handleResetData}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-amber-400 hover:bg-amber-950/40 hover:text-amber-300 font-semibold transition"
          title="Khôi phục dữ liệu mẫu ban đầu"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Khôi Phục Seed Data</span>
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition font-semibold"
        >
          <Store className="w-4 h-4" />
          <span>Về Cửa Hàng (Store)</span>
        </Link>

        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 font-semibold transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng Xuất</span>
        </button>
      </div>
    </aside>
  );
}
