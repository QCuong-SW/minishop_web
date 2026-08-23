"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProductCard } from "@/components/shared/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { StorageService } from "@/lib/storage";
import { Heart, ChevronRight, ShoppingBag } from "lucide-react";

export default function WishlistPage() {
  const { wishlistProducts, refreshWishlist } = useWishlist();

  useEffect(() => {
    StorageService.init();
    refreshWishlist();
  }, []);

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
