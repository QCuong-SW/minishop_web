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
  Sparkles,
  Tag,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shared/ProductCard";
import { getCategories, getProducts } from "@/features/products/product.api";
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
    async function loadData() {
      try {
        const [prodsData, catsData] = await Promise.all([
          getProducts({ limit: 12, sort: "newest" }),
          getCategories(),
        ]);
        setProducts(prodsData.items || []);
        setCategories(catsData || []);
      } catch (err) {
        console.error("Error loading home data:", err);
      }
    }
    loadData();

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

      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 w-full space-y-8 sm:space-y-10">
        {/* Hero Banner Slider / Section */}
        <section className="relative hero-glow-container light-sweep rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 via-shopee-orange to-amber-500 text-white shadow-2xl p-5 sm:p-8 md:p-14 border border-orange-300/40">
          <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/4 -top-12 w-64 h-64 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-3.5 sm:space-y-5">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wide uppercase">
              <Flame className="w-3.5 h-3.5" /> Siêu Khuyến Mãi 2026
            </span>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              Khám Phá Phong Cách <br />
              <span className="text-amber-200">Trải Nghiệm Đỉnh Cao</span>
            </h1>

            <p className="text-orange-100 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
              Hàng ngàn sản phẩm thời trang xu hướng, giày sneaker và phụ kiện công nghệ chính hãng.
              Ưu đãi giảm giá tới 50% cùng dịch vụ đặt hẹn thử đồ trực tiếp tại Showroom.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2 sm:pt-3">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-white text-shopee-orange font-black px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl shadow-xl hover:bg-orange-50 hover:shadow-orange-950/20 transition active:scale-95 text-xs sm:text-sm text-center"
              >
                Mua Sắm Ngay <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/appointments"
                className="inline-flex items-center justify-center gap-2 bg-black/30 backdrop-blur-md text-white font-bold px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl hover:bg-black/40 transition active:scale-95 text-xs sm:text-sm border border-white/20 text-center"
              >
                <Calendar className="w-4 h-4" /> Đặt Lịch Showroom
              </Link>
            </div>
          </div>
        </section>

        {/* Value Propositions Marquee Conveyor Belt */}
        <section className="relative overflow-hidden py-1">
          {/* Gradient Masks for smooth edge fading */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

          <div className="marquee-track flex gap-4">
            {[1, 2, 3].map((setIndex) => (
              <div key={setIndex} className="flex gap-4 flex-shrink-0">
                <div className="w-64 sm:w-72 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-orange-200 transition cursor-default flex-shrink-0">
                  <div className="p-3 bg-orange-50 text-shopee-orange rounded-2xl flex-shrink-0">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Freeship Toàn Quốc</h3>
                    <p className="text-xs text-slate-500">Đơn hàng từ 200.000 đ</p>
                  </div>
                </div>

                <div className="w-64 sm:w-72 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-orange-200 transition cursor-default flex-shrink-0">
                  <div className="p-3 bg-orange-50 text-shopee-orange rounded-2xl flex-shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">100% Chính Hãng</h3>
                    <p className="text-xs text-slate-500">Bảo hành chính hãng</p>
                  </div>
                </div>

                <div className="w-64 sm:w-72 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-orange-200 transition cursor-default flex-shrink-0">
                  <div className="p-3 bg-orange-50 text-shopee-orange rounded-2xl flex-shrink-0">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Đổi Trả 7 Ngày</h3>
                    <p className="text-xs text-slate-500">Nhanh chóng & dễ dàng</p>
                  </div>
                </div>

                <div className="w-64 sm:w-72 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-orange-200 transition cursor-default flex-shrink-0">
                  <div className="p-3 bg-orange-50 text-shopee-orange rounded-2xl flex-shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Hẹn Thử Showroom</h3>
                    <p className="text-xs text-slate-500">Trải nghiệm thực tế</p>
                  </div>
                </div>
              </div>
            ))}
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

        {/* Flash Deals */}
        <section className="light-sweep bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 rounded-3xl p-6 md:p-8 border border-orange-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-shopee-orange text-white rounded-xl shadow-md">
                <Zap className="w-6 h-6 fill-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>FLASH DEALS GIỜ VÀNG</span>
                </h2>
                <p className="text-xs text-slate-500">Giảm giá sốc - Số lượng có hạn</p>
              </div>
            </div>

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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Product Feed */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-shopee-orange" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">Gợi Ý Hôm Nay Dành Cho Bạn</h2>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-stretch sm:self-auto overflow-x-auto text-xs font-bold no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-lg transition flex-shrink-0 ${
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
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 flex-shrink-0 ${
                  activeTab === "hot"
                    ? "bg-shopee-orange text-white shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${activeTab === "hot" ? "text-white fill-white" : "text-rose-500"}`} />
                <span>Bán Chạy</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("new")}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 flex-shrink-0 ${
                  activeTab === "new"
                    ? "bg-shopee-orange text-white shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${activeTab === "new" ? "text-white" : "text-blue-500"}`} />
                <span>Mới Nhất</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("discount")}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 flex-shrink-0 ${
                  activeTab === "discount"
                    ? "bg-shopee-orange text-white shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Tag className={`w-3.5 h-3.5 ${activeTab === "discount" ? "text-white" : "text-emerald-500"}`} />
                <span>Giảm Giá Sốc</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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
        <section className="light-sweep bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-indigo-500/30">
          <div className="space-y-4 max-w-xl">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Dịch Vụ Độc Quyền Tại MiniShop
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
