"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Eye, Heart, CheckCircle2 } from "lucide-react";
import { Product } from "@/types";
import { formatVND, calculateDiscountPercent } from "@/lib/utils";
import { RatingStars } from "./RatingStars";
import { QuantityPicker } from "./QuantityPicker";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { requireCustomerAuth } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>("");

  if (!isOpen || !product) return null;

  const images = product.images && product.images.length ? product.images : [product.image_url];
  const activeImage = selectedImage || product.image_url;
  const discount = calculateDiscountPercent(product.price, product.original_price);
  const isFav = isWishlisted(product.id);

  const handleAddToCart = () => {
    if (requireCustomerAuth("thêm sản phẩm vào giỏ hàng", "/cart")) {
      addToCart(product.id, quantity);
      onClose();
    }
  };

  const handleToggleWishlist = () => {
    if (requireCustomerAuth("lưu sản phẩm vào danh sách yêu thích", "/wishlist")) {
      toggleWishlist(product.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={activeImage}
                alt={product.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600";
                }}
                className="w-full h-full object-cover object-center"
              />
              {discount > 0 && (
                <div className="absolute top-3 left-3 bg-shopee-orange text-white text-xs font-black px-2.5 py-1 rounded-lg shadow">
                  -{discount}%
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                      activeImage === img ? "border-shopee-orange shadow-sm" : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                {product.category_name || "Sản phẩm"}
              </span>

              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {product.name}
              </h2>

              <div className="flex items-center gap-4 text-xs">
                <RatingStars rating={product.rating_avg} count={product.rating_count} showText />
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-medium">Đã bán {product.sold_count || 120}+</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 p-3.5 bg-orange-50/50 rounded-2xl border border-orange-100">
                <span className="text-2xl font-black text-shopee-orange">
                  {formatVND(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatVND(product.original_price)}
                  </span>
                )}
              </div>

              {/* Description summary */}
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {product.description}
              </p>

              {/* Stock status */}
              <div className="flex items-center gap-2 text-xs">
                {product.stock > 0 ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-emerald-700">
                      Còn hàng ({product.stock} sản phẩm)
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      Hết hàng (Tạm thời không có sẵn)
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700">Số lượng:</span>
                <QuantityPicker
                  quantity={product.stock <= 0 ? 0 : quantity}
                  maxStock={product.stock}
                  onChange={setQuantity}
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`flex-1 py-3 px-4 font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-95 ${
                    product.stock <= 0
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                      : "bg-shopee-orange text-white hover:bg-shopee-hover"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" /> {product.stock <= 0 ? "Hết Hàng" : "Thêm Vào Giỏ"}
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition ${
                    isFav
                      ? "border-rose-300 bg-rose-50 text-rose-500"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                  aria-label="Yêu thích"
                >
                  <Heart className={`w-5 h-5 ${isFav ? "fill-rose-500" : ""}`} />
                </button>
              </div>

              <div className="text-center">
                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="text-xs font-bold text-shopee-orange hover:underline inline-flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Xem chi tiết đầy đủ sản phẩm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
