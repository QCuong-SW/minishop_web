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
  ShieldCheck,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/admin", label: "Tổng Quan (Dashboard)", icon: LayoutDashboard },
    { href: "/admin/products", label: "Quản Lý Sản Phẩm", icon: Package },
    { href: "/admin/categories", label: "Quản Lý Danh Mục", icon: Layers },
    { href: "/admin/orders", label: "Quản Lý Đơn Hàng", icon: ShoppingBag },
    { href: "/admin/coupons", label: "Mã Giảm Giá (Coupons)", icon: Ticket },
    { href: "/admin/appointments", label: "Lịch Hẹn Showroom", icon: Calendar },
    { href: "/admin/users", label: "Khách Hàng & Quyền", icon: Users },
  ];

  const sidebarContent = (
<div className="flex h-full min-h-screen flex-col p-4">
        <div className="space-y-6">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-shopee-orange to-amber-500 text-white shadow-md">
              <ShieldCheck className="h-5 w-5 text-white stroke-[2.5]" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-black leading-tight tracking-tight text-white">
                MiniShop<span className="text-shopee-orange"> Admin</span>
              </h2>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Control Panel
              </p>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white md:hidden"
              aria-label="Đóng menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

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
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-shopee-orange font-bold text-white shadow-md shadow-orange-950"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="min-w-0 truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: sticky để sidebar vẫn chiếm chỗ trong layout, không đè content */}
      <aside className="hidden md:flex sticky top-0 self-start h-screen min-h-screen w-64 shrink-0 bg-slate-900 text-slate-300 flex-col border-r border-slate-800 overflow-y-auto no-scrollbar z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Đóng menu"
            className="fixed inset-0 cursor-default bg-slate-950/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80vw] flex-col overflow-y-auto border-r border-slate-800 bg-slate-900 text-slate-300 shadow-2xl animate-in slide-in-from-left duration-200 no-scrollbar">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
