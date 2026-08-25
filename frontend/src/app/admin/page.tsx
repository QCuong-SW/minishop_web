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
  LayoutDashboard,
  BarChart3,
  Activity,
  Sparkles,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [chartMode, setChartMode] = useState<"SPLINE" | "BAR">("SPLINE");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

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
      toast.success(`Đã duyệt nhanh đơn hàng #${orderId} sang trạng thái ĐÃ XÁC NHẬN!`);
      fetchStats();
    } catch (err: any) {
      toast.error(err.message || "Lỗi duyệt đơn");
    }
  };

  if (!stats) {
    return <div className="p-8 text-center text-slate-500">Đang tải số liệu thống kê...</div>;
  }

  const maxRevenue = Math.max(...stats.sales_chart.map((c) => c.revenue));
  const total7DayRevenue = stats.sales_chart.reduce((acc, curr) => acc + curr.revenue, 0);
  const total7DayOrders = stats.sales_chart.reduce((acc, curr) => acc + curr.orders, 0);
  const peakDay = stats.sales_chart.reduce(
    (prev, curr) => (curr.revenue > prev.revenue ? curr : prev),
    stats.sales_chart[0] || { date: "", revenue: 0, orders: 0 }
  );

  // SVG Geometry Calculation (viewBox 0 0 700 220)
  const svgWidth = 700;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingYTop = 30;
  const paddingYBottom = 30;
  const chartPlotHeight = svgHeight - paddingYTop - paddingYBottom;
  const chartPlotWidth = svgWidth - paddingX * 2;

  const points = stats.sales_chart.map((d, i) => {
    const x = paddingX + (i / Math.max(1, stats.sales_chart.length - 1)) * chartPlotWidth;
    const ratio = maxRevenue > 0 ? d.revenue / maxRevenue : 0.5;
    const y = paddingYTop + (1 - ratio) * chartPlotHeight;
    return { x, y, data: d, index: i };
  });

  let linePath = "";
  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      linePath += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
  }

  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingYBottom} L ${points[0].x} ${
          svgHeight - paddingYBottom
        } Z`
      : "";

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : points[points.length - 1];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <LayoutDashboard className="w-6 h-6 text-shopee-orange" />
            <span>Tổng Quan Kinh Doanh (Dashboard)</span>
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
            <p className="text-[11px] text-blue-600 font-semibold mt-1">
              +12 đơn mới trong ngày
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
            <p className="text-[11px] text-slate-500 mt-1">
              {stats.overview.total_categories} danh mục chính
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

      {/* Modern High-End Interactive Chart Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-orange-50 text-shopee-orange rounded-xl">
                <Activity className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Phân Tích Tăng Trưởng Doanh Thu & Đơn Hàng
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Biểu đồ trực quan hóa dữ liệu bán hàng thực tế 7 ngày gần nhất
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Metrics Badges */}
            <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200">
              <span className="text-slate-500">Đỉnh điểm:</span>
              <strong className="text-shopee-orange">
                {peakDay?.date} ({formatVND(peakDay?.revenue || 0)})
              </strong>
            </div>

            {/* Chart Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setChartMode("SPLINE")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  chartMode === "SPLINE"
                    ? "bg-white text-shopee-orange shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Sóng Doanh Thu (Spline)</span>
              </button>
              <button
                type="button"
                onClick={() => setChartMode("BAR")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  chartMode === "BAR"
                    ? "bg-white text-shopee-orange shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Cột Đơn Hàng (Bars)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Hover Info Banner */}
        <div className="bg-gradient-to-r from-orange-50/80 via-amber-50/50 to-slate-50 p-4 rounded-2xl border border-orange-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-shopee-orange animate-ping" />
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Điểm Đang Chọn ({activePoint?.data.date}):
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-xl font-black text-slate-900">
                  {formatVND(activePoint?.data.revenue || 0)}
                </span>
                <span className="text-xs font-bold text-shopee-orange bg-white px-2 py-0.5 rounded-full border border-orange-200 shadow-sm">
                  {activePoint?.data.orders} đơn hàng
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase">Tổng tuần</p>
              <p className="font-black text-slate-800">{formatVND(total7DayRevenue)}</p>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase">Tổng đơn</p>
              <p className="font-black text-slate-800">{total7DayOrders} đơn</p>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase">AOV (TB/Đơn)</p>
              <p className="font-black text-emerald-600">
                {total7DayOrders > 0 ? formatVND(Math.round(total7DayRevenue / total7DayOrders)) : "0 đ"}
              </p>
            </div>
          </div>
        </div>

        {/* Visual Chart View Area */}
        <div className="relative w-full pt-4">
          {chartMode === "SPLINE" ? (
            <div className="relative w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-56 sm:h-64 overflow-visible"
              >
                <defs>
                  {/* Glowing Area Fill Gradient */}
                  <linearGradient id="areaGradientGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ee4d2d" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Line Gradient */}
                  <linearGradient id="lineStrokeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ee4d2d" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>

                  {/* Soft Shadow Filter */}
                  <filter id="splineShadow" x="-10%" y="-10%" width="120%" height="130%">
                    <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#ee4d2d" floodOpacity="0.3" />
                  </filter>
                </defs>

                {/* Horizontal Reference Gridlines */}
                {[0.25, 0.5, 0.75, 1].map((val, gIdx) => {
                  const yLine = paddingYTop + (1 - val) * chartPlotHeight;
                  return (
                    <g key={gIdx}>
                      <line
                        x1={paddingX}
                        y1={yLine}
                        x2={svgWidth - paddingX}
                        y2={yLine}
                        stroke="#f1f5f9"
                        strokeDasharray="4 4"
                        strokeWidth="1.5"
                      />
                      <text
                        x={paddingX - 10}
                        y={yLine + 4}
                        textAnchor="end"
                        fontSize="10"
                        fontWeight="600"
                        fill="#94a3b8"
                      >
                        {formatVND(Math.round(maxRevenue * val))}
                      </text>
                    </g>
                  );
                })}

                {/* Baseline */}
                <line
                  x1={paddingX}
                  y1={svgHeight - paddingYBottom}
                  x2={svgWidth - paddingX}
                  y2={svgHeight - paddingYBottom}
                  stroke="#e2e8f0"
                  strokeWidth="1.5"
                />

                {/* Shaded Area Under Curve */}
                <path d={areaPath} fill="url(#areaGradientGlow)" />

                {/* Glowing Smooth Spline Curve Line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="url(#lineStrokeGradient)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  filter="url(#splineShadow)"
                />

                {/* Interactive Points & Tooltips */}
                {points.map((pt, i) => {
                  const isHovered = hoveredIdx === i || (hoveredIdx === null && i === points.length - 1);
                  return (
                    <g
                      key={i}
                      onMouseEnter={() => setHoveredIdx(i)}
                      className="cursor-pointer transition-all"
                    >
                      {/* Vertical Indicator Guide when Active */}
                      {isHovered && (
                        <line
                          x1={pt.x}
                          y1={paddingYTop}
                          x2={pt.x}
                          y2={svgHeight - paddingYBottom}
                          stroke="#ee4d2d"
                          strokeDasharray="3 3"
                          strokeWidth="1.5"
                          opacity="0.6"
                        />
                      )}

                      {/* Outer Ring on Active */}
                      {isHovered && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="12"
                          fill="#ee4d2d"
                          fillOpacity="0.2"
                          className="animate-ping"
                        />
                      )}

                      {/* White Core Circle */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? "7" : "5"}
                        fill="#ffffff"
                        stroke="#ee4d2d"
                        strokeWidth="3.5"
                        className="transition-all"
                      />

                      {/* X-Axis Date Label */}
                      <text
                        x={pt.x}
                        y={svgHeight - 10}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight={isHovered ? "bold" : "600"}
                        fill={isHovered ? "#ee4d2d" : "#64748b"}
                      >
                        {pt.data.date}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : (
            /* Modern Rounded Floating Bars View */
            <div className="grid grid-cols-7 gap-3 sm:gap-6 items-end h-56 border-b border-slate-200 pb-3 pt-4">
              {stats.sales_chart.map((chartItem, idx) => {
                const heightPercent = maxRevenue > 0 ? (chartItem.revenue / maxRevenue) * 100 : 20;
                const isHovered = hoveredIdx === idx;

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                  >
                    {/* Tooltip on top */}
                    <div
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg text-center whitespace-nowrap shadow-md transition-all ${
                        isHovered
                          ? "bg-shopee-orange text-white scale-105"
                          : "bg-slate-900 text-white opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {formatVND(chartItem.revenue)}
                    </div>

                    {/* Bar Container with Background Track */}
                    <div className="w-full max-w-[48px] h-full flex items-end bg-slate-100 rounded-2xl p-1 overflow-hidden">
                      <div
                        className={`w-full rounded-xl transition-all duration-500 shadow-sm ${
                          isHovered
                            ? "bg-gradient-to-t from-orange-600 to-amber-400 shadow-orange-500/30"
                            : "bg-gradient-to-t from-shopee-orange to-amber-300"
                        }`}
                        style={{ height: `${Math.max(18, heightPercent)}%` }}
                      />
                    </div>

                    {/* Day Label */}
                    <span
                      className={`text-[11px] transition-colors ${
                        isHovered ? "font-black text-shopee-orange" : "font-bold text-slate-600"
                      }`}
                    >
                      {chartItem.date}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
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
