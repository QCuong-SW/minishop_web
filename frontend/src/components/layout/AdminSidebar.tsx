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
    <div className="flex flex-col justify-between h-full p-4">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-shopee-orange to-amber-500 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-black text-white text-base leading-tight tracking-tight">
                MiniShop<span className="text-shopee-orange"> Admin</span>
              </h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Control Panel
              </p>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
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
                onClick={onClose}
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
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Fixed/Sticky Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 flex-col border-r border-slate-800 flex-shrink-0 overflow-y-auto no-scrollbar z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Drawer Content */}
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-slate-900 text-slate-300 shadow-2xl z-50 flex flex-col border-r border-slate-800 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
