"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  Award,
  ArrowRight,
  Zap,
  TrendingUp,
  Clock,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Calendar,
  Layers,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shared/ProductCard";
import { StorageService } from "@/lib/storage";
import { Product, Category } from "@/types";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "hot" | "new" | "discount">("all");

  // Countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    StorageService.init();
    const prods = StorageService.getProducts().items;
    const cats = StorageService.getCategories();
    setProducts(prods);
    setCategories(cats);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter products by tab
  const getFilteredProducts = () => {
    let list = [...products];
    switch (activeTab) {
      case "hot":
        return list.sort((a, b) => (b.sold_count || 0) - (a.sold_count || 0));
      case "new":
        return list.sort((a, b) => b.id - a.id);
      case "discount":
        return list.filter((p) => p.original_price && p.original_price > p.price);
      case "all":
      default:
        return list;
    }
  };

  const flashSaleProducts = products.filter(
    (p) => p.original_price && p.original_price > p.price
  ).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full space-y-10">
        {/* Hero Banner Slider / Section */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 via-shopee-orange to-amber-500 text-white shadow-2xl p-8 md:p-14">
          {/* Decorative background shapes */}
          <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/4 -top-12 w-64 h-64 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">
              <Flame className="w-3.5 h-3.5" /> Siêu Khuyến Mãi 2026
            </span>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              Khám Phá Phong Cách <br />
              <span className="text-amber-200">Trải Nghiệm Đỉnh Cao</span>
            </h1>

            <p className="text-orange-100 text-sm md:text-base leading-relaxed max-w-xl">
              Hàng ngàn sản phẩm thời trang xu hướng, giày sneaker và phụ kiện công nghệ chính hãng.
              Ưu đãi giảm giá tới 50% cùng dịch vụ đặt hẹn thử đồ trực tiếp tại Showroom.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white text-shopee-orange font-black px-7 py-3.5 rounded-2xl shadow-xl hover:bg-orange-50 hover:shadow-orange-950/20 transition active:scale-95 text-sm"
              >
                Mua Sắm Ngay <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/appointments"
                className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-black/40 transition active:scale-95 text-sm border border-white/20"
              >
                <Calendar className="w-4 h-4" /> Đặt Lịch Showroom
              </Link>
            </div>
          </div>
        </section>

        {/* Value Propositions */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="p-3 bg-orange-50 text-shopee-orange rounded-2xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Freeship Toàn Quốc</h3>
              <p className="text-xs text-slate-500">Đơn hàng từ 200.000 đ</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="p-3 bg-orange-50 text-shopee-orange rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">100% Chính Hãng</h3>
              <p className="text-xs text-slate-500">Bảo hành chính hãng</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="p-3 bg-orange-50 text-shopee-orange rounded-2xl">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Đổi Trả 7 Ngày</h3>
              <p className="text-xs text-slate-500">Nhanh chóng & dễ dàng</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="p-3 bg-orange-50 text-shopee-orange rounded-2xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Hẹn Thử Showroom</h3>
              <p className="text-xs text-slate-500">Trải nghiệm thực tế</p>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-shopee-orange" />
              <h2 className="text-xl font-bold text-slate-800">Danh Mục Nổi Bật</h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-shopee-orange hover:underline flex items-center gap-1"
            >
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category_id=${cat.id}`}
                className="group bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all flex flex-col items-center text-center space-y-3"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-slate-100 p-1 border-2 border-orange-100 group-hover:scale-105 transition-transform">
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-shopee-orange transition">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {cat.product_count || 3} sản phẩm
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Flash Deals / Chớp Nhoáng */}
        <section className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 rounded-3xl p-6 md:p-8 border border-orange-200/60 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-shopee-orange text-white rounded-xl shadow-md">
                <Zap className="w-6 h-6 fill-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  ⚡ FLASH DEALS GIỜ VÀNG
                </h2>
                <p className="text-xs text-slate-500">Giảm giá sốc - Số lượng có hạn</p>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-2xl shadow-md self-start sm:self-auto">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-medium text-slate-300">Kết thúc sau:</span>
              <div className="flex items-center gap-1 font-mono font-black text-xs">
                <span className="bg-slate-800 px-2 py-1 rounded-md text-amber-300">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span>:</span>
                <span className="bg-slate-800 px-2 py-1 rounded-md text-amber-300">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span>:</span>
                <span className="bg-slate-800 px-2 py-1 rounded-md text-amber-300">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* Flash Sale Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Product Feed: Gợi Ý Hôm Nay */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-shopee-orange" />
              <h2 className="text-xl font-bold text-slate-800">Gợi Ý Hôm Nay Dành Cho Bạn</h2>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  activeTab === "all"
                    ? "bg-shopee-orange text-white shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tất Cả
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("hot")}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  activeTab === "hot"
                    ? "bg-shopee-orange text-white shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Bán Chạy 🔥
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("new")}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  activeTab === "new"
                    ? "bg-shopee-orange text-white shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Mới Nhất 🆕
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("discount")}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  activeTab === "discount"
                    ? "bg-shopee-orange text-white shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Giá Tốt 🏷️
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {getFilteredProducts().map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-slate-800 font-bold text-sm rounded-2xl border border-slate-200 hover:border-shopee-orange hover:text-shopee-orange shadow-sm hover:shadow transition active:scale-95"
            >
              Xem Thêm Hàng Trăm Sản Phẩm Khác <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Showroom Experience Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
          <div className="space-y-4 max-w-xl">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Dịch Vụ Độc Quyền Tại Shopee Mini
            </span>
            <h2 className="text-2xl md:text-4xl font-black leading-tight">
              Trải Nghiệm Trực Tiếp Tại Showroom Cửa Hàng
            </h2>
            <p className="text-slate-300 text-xs md:pm-sm leading-relaxed">
              Bạn phân vân về size áo, muốn nghe thử chất âm tai nghe ANC hay gõ thử các loại switch bàn phím cơ? Đặt lịch hẹn ngay để được chuyên viên tư vấn riêng 1-1 miễn phí!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              href="/appointments"
              className="px-8 py-3.5 bg-gradient-to-r from-shopee-orange to-amber-500 text-white font-bold text-sm rounded-2xl shadow-xl hover:shadow-orange-500/20 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Đặt Lịch Hẹn Ngay
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
