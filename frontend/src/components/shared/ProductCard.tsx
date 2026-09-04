"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Heart, Eye, Ban } from "lucide-react";
import { Product } from "@/types";
import { formatVND, calculateDiscountPercent } from "@/lib/utils";
import { RatingStars } from "./RatingStars";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { QuickViewModal } from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const [imgSrc, setImgSrc] = useState(
    product.image_url || "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600"
  );

  React.useEffect(() => {
    setImgSrc(product.image_url || "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600");
  }, [product.image_url]);

  const discount = calculateDiscountPercent(product.price, product.original_price);
  const isFav = isWishlisted(product.id);
  const isOutOfStock = product.stock <= 0 || product.status === "INACTIVE";

  return (
    <>
      <div className={`group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col justify-between overflow-hidden ${isOutOfStock ? "opacity-85" : ""}`}>
        {/* Product Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
          <Link href={`/products/${product.slug}`} className="block w-full h-full">
            <img
              src={imgSrc}
              alt={product.name}
              onError={() => {
                setImgSrc("https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600");
              }}
              className={`w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ${isOutOfStock ? "grayscale-[30%]" : ""}`}
            />
          </Link>

          {/* Out of Stock Overlay Badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
              <span className="bg-rose-600 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-lg uppercase tracking-wider flex items-center gap-1">
                <Ban className="w-3.5 h-3.5" /> Hết Hàng
              </span>
            </div>
          )}

          {/* Discount Badge */}
          {!isOutOfStock && discount > 0 && (
            <div className="absolute top-2.5 left-2.5 bg-shopee-orange text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-sm">
              -{discount}%
            </div>
          )}

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            aria-label="Yêu thích"
            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-sm hover:bg-white text-slate-500 hover:text-rose-500 transition-all active:scale-90"
          >
            <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>

          {/* Quick View Button on Hover */}
          <div className="absolute inset-x-3 bottom-3 hidden md:flex opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <button
              type="button"
              onClick={() => setIsQuickViewOpen(true)}
              className="w-full py-2 bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold rounded-xl backdrop-blur-md shadow-lg flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" /> Xem Nhanh
            </button>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3">
          <div className="space-y-1 sm:space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider block truncate max-w-[100px]">
                {product.category_name || "Sản phẩm"}
              </span>
              {isOutOfStock && (
                <span className="text-[9px] sm:text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                  Hết hàng
                </span>
              )}
            </div>
            <Link
              href={`/products/${product.slug}`}
              className="font-bold text-slate-800 text-xs sm:text-sm hover:text-shopee-orange transition line-clamp-2 leading-snug min-h-[2rem] sm:min-h-[2.5rem]"
              title={product.name}
            >
              {product.name}
            </Link>
          </div>

          <div className="space-y-2 pt-0.5 sm:pt-1">
            {/* Rating & Sold count */}
            <div className="flex items-center justify-between text-[11px] gap-1">
              <RatingStars rating={product.rating_avg} size="sm" showText count={product.rating_count} />
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">
                Đã bán {product.sold_count || 50}+
              </span>
            </div>

            {/* Price & Add to Cart */}
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
              <div className="flex flex-col min-w-0 pr-1">
                <span className="text-sm sm:text-base font-black text-shopee-orange truncate">
                  {formatVND(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-[10px] sm:text-[11px] text-slate-400 line-through truncate">
                    {formatVND(product.original_price)}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => addToCart(product.id, 1)}
                disabled={isOutOfStock}
                className={`p-2 sm:p-2.5 rounded-xl transition-all shadow-sm flex-shrink-0 ${
                  isOutOfStock
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-orange-50 text-shopee-orange hover:bg-shopee-orange hover:text-white active:scale-90"
                }`}
                title={isOutOfStock ? "Sản phẩm đã hết hàng" : "Thêm vào giỏ hàng"}
              >
                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
