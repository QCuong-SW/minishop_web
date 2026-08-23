"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StorageService } from "@/lib/storage";
import { DashboardStats, OrderStatus } from "@/types";
import { formatVND, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);

  const fetchStats = () => {
    StorageService.init();
    const data = StorageService.getDashboardStats();
    setStats(data);

    const prods = StorageService.getProducts().items;
    setLowStockProducts(prods.filter((p) => p.stock <= 45));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickApprove = (orderId: number) => {
    try {
      StorageService.updateOrderStatus(orderId, "CONFIRMED");
      toast.success(`Đã duyệt nhanh đơn hàng #${orderId} sang trạng thái ĐÃ XÁC NHẬN! 🚀`);
      fetchStats();
    } catch (err: any) {
      toast.error(err.message || "Lỗi duyệt đơn");
    }
  };

  if (!stats) {
    return <div className="p-8 text-center text-slate-500">Đang tải số liệu thống kê...</div>;
  }

  const maxRevenue = Math.max(...stats.sales_chart.map((c) => c.revenue));

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            📊 Tổng Quan Kinh Doanh (Dashboard)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi doanh thu, hiệu suất đơn hàng và các chỉ số kinh doanh cốt lõi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-shopee-orange text-white font-bold text-xs rounded-xl shadow hover:bg-shopee-hover transition"
          >
            + Thêm Sản Phẩm Mới
          </Link>
        </div>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Tổng Doanh Thu
            </span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">
              {formatVND(stats.overview.total_revenue)}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18.5% so với tháng trước
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Tổng Đơn Hàng
            </span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">
              {stats.overview.total_orders} <span className="text-sm font-normal text-slate-500">đơn</span>
            </p>
            <p className="text-[11px] text-blue-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12 đơn mới trong ngày
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Sản Phẩm Đang Bán
            </span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">
              {stats.overview.total_products} <span className="text-sm font-normal text-slate-500">mặt hàng</span>
            </p>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">
              4 danh mục chính
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Khách Hàng Đăng Ký
            </span>
            <div className="p-2.5 bg-orange-50 text-shopee-orange rounded-2xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">
              {stats.overview.total_users} <span className="text-sm font-normal text-slate-500">thành viên</span>
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              Tỷ lệ quay lại 85%
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Chart Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-shopee-orange" />
              Biểu Đồ Doanh Thu 7 Ngày Gần Nhất
            </h2>
            <p className="text-xs text-slate-400">Thống kê doanh số bán hàng thực tế theo từng ngày</p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            Đơn vị: VNĐ
          </span>
        </div>

        {/* CSS Visual Bar Chart */}
        <div className="pt-6 pb-2">
          <div className="grid grid-cols-7 gap-3 sm:gap-6 items-end h-52 border-b border-slate-200 pb-3">
            {stats.sales_chart.map((chartItem, idx) => {
              const heightPercent = maxRevenue > 0 ? (chartItem.revenue / maxRevenue) * 100 : 20;

              return (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded-md text-center whitespace-nowrap shadow-md pointer-events-none -mb-1">
                    {formatVND(chartItem.revenue)} ({chartItem.orders} đơn)
                  </div>

                  {/* Visual Bar */}
                  <div
                    className="w-full max-w-[48px] bg-gradient-to-t from-shopee-orange to-amber-400 rounded-t-xl group-hover:from-orange-600 group-hover:to-amber-500 transition-all shadow-sm"
                    style={{ height: `${Math.max(15, heightPercent)}%` }}
                  />

                  {/* Day Label */}
                  <span className="text-[11px] font-bold text-slate-600">{chartItem.date}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2-Column Section: Urgent Pending Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Urgent Pending Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Đơn Hàng Mới Cần Xử Lý ({stats.recent_orders.length})
              </h2>
              <p className="text-[11px] text-slate-400">Duyệt nhanh để chuyển đơn sang bộ phận đóng gói</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-shopee-orange hover:underline flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {stats.recent_orders.map((ord) => (
              <div key={ord.id} className="py-3 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{ord.order_code}</span>
                    <span className="font-semibold text-slate-600">({ord.customer_name})</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{formatDate(ord.created_at)}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">{formatVND(ord.final_amount)}</span>
                  {ord.status === "PENDING" ? (
                    <button
                      type="button"
                      onClick={() => handleQuickApprove(ord.id)}
                      className="px-3 py-1.5 bg-shopee-orange hover:bg-shopee-hover text-white font-bold rounded-xl shadow-sm transition active:scale-95 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Duyệt nhanh
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold text-[11px]">
                      {ord.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Low Stock Warnings */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <h2 className="font-bold text-slate-900 text-sm">Cảnh Báo Tồn Kho Thấp</h2>
          </div>

          <div className="space-y-3 text-xs">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100 flex items-center justify-between"
              >
                <div className="space-y-0.5 min-w-0 pr-2">
                  <p className="font-bold text-slate-900 truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-500">{p.category_name}</p>
                </div>
                <span className="font-black text-rose-600 bg-white px-2 py-0.5 rounded-lg border border-rose-200 flex-shrink-0">
                  Còn {p.stock} sp
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/admin/products"
            className="block text-center text-xs font-bold text-shopee-orange hover:underline pt-2"
          >
            Nhập thêm hàng trong Quản lý sản phẩm &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
