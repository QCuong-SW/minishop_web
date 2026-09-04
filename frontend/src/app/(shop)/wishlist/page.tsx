"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProductCard } from "@/components/shared/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { StorageService } from "@/lib/storage";
import { Heart, ChevronRight, ShoppingBag, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { wishlistProducts, refreshWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    StorageService.init();
    if (user && user.role === "USER") {
      refreshWishlist();
    }
  }, [user]);

  if (!user || user.role !== "USER") {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto px-4 py-16 w-full flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl text-center space-y-6 w-full animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-rose-100">
              <Heart className="w-10 h-10 stroke-[2.2] fill-rose-500" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full">
                Yêu Cầu Đăng Nhập
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Sản Phẩm Yêu Thích
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                {user?.role === "ADMIN"
                  ? "Bạn đang duyệt cửa hàng ở chế độ Quản Trị Viên (Khách vãng lai). Vui lòng đăng nhập bằng tài khoản Khách Hàng để quản lý danh sách yêu thích!"
                  : "Vui lòng đăng nhập tài khoản Khách Hàng để lưu lại các món đồ thời trang yêu thích và nhận thông báo giảm giá."}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href="/login?redirect=/wishlist"
                className="w-full py-3.5 px-6 bg-gradient-to-r from-shopee-orange to-amber-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>🔐 Đăng Nhập Xem Yêu Thích</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products"
                className="w-full py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>🛍️ Khám Phá Sản Phẩm</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-shopee-orange">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800">Sản Phẩm Yêu Thích</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-500 rounded-2xl">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Sản Phẩm Yêu Thích ({wishlistProducts.length})
            </h1>
            <p className="text-xs text-slate-500">
              Các món đồ bạn đang quan tâm để mua sau
            </p>
          </div>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="Danh sách yêu thích trống"
            description="Bạn chưa lưu sản phẩm nào vào mục yêu thích. Hãy bấm vào biểu tượng trái tim ở các sản phẩm để lưu lại nhé!"
            actionText="Khám phá sản phẩm ngay"
            actionHref="/products"
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
