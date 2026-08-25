"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RatingStars } from "@/components/shared/RatingStars";
import { QuantityPicker } from "@/components/shared/QuantityPicker";
import { ProductCard } from "@/components/shared/ProductCard";
import { DetailSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { getProductBySlug, getProducts, getProductReviews } from "@/features/products/product.api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Product, Review } from "@/types";
import { formatVND, calculateDiscountPercent, formatDate } from "@/lib/utils";
import {
  ShoppingCart,
  Zap,
  Heart,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Calendar,
  MessageSquare,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "policy">("desc");

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    async function loadProductDetail() {
      try {
        const prod = await getProductBySlug(slug);
        if (!isCancelled && prod) {
          setProduct(prod);
          setSelectedImage(prod.image_url);

          const [revs, rel] = await Promise.all([
            getProductReviews(prod.id),
            getProducts({ category_id: prod.category_id, limit: 5 }),
          ]);

          if (!isCancelled) {
            setReviews(revs || prod.reviews || []);
            setRelatedProducts((rel.items || []).filter((p) => p.id !== prod.id).slice(0, 4));
          }
        }
      } catch (err) {
        console.error("Error loading product details:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadProductDetail();
    return () => {
      isCancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
          <DetailSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
          <EmptyState
            title="Không tìm thấy sản phẩm"
            description="Sản phẩm bạn đang tìm kiếm có thể đã ngừng kinh doanh hoặc đường dẫn không chính xác."
            actionText="Quay lại danh sách sản phẩm"
            actionHref="/products"
          />
        </main>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length ? product.images : [product.image_url];
  const discount = calculateDiscountPercent(product.price, product.original_price);
  const isFav = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity);
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-shopee-orange">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-shopee-orange">Sản phẩm</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-400">{product.category_name}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800 line-clamp-1">{product.name}</span>
        </div>

        {/* Product Main Container */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner group">
              <img
                src={selectedImage || product.image_url}
                alt={product.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600";
                }}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-shopee-orange text-white text-xs font-black px-3 py-1 rounded-xl shadow-md">
                  GIẢM {discount}%
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      (selectedImage || product.image_url) === img
                        ? "border-shopee-orange shadow-md scale-102"
                        : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt="thumbnail"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600";
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                {product.category_name}
              </span>

              <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Sold count */}
              <div className="flex items-center gap-4 text-xs">
                <RatingStars
                  rating={product.rating_avg}
                  size="md"
                  showText
                  count={product.rating_count}
                />
                <span className="text-slate-300">|</span>
                <span className="text-slate-600 font-medium">
                  Đã bán <strong className="text-slate-900">{product.sold_count || 120}</strong>
                </span>
                <span className="text-slate-300">|</span>
                <span className={`font-bold px-2 py-0.5 rounded ${product.stock > 0 ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"}`}>
                  {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : "Tạm hết hàng"}
                </span>
              </div>

              {/* Pricing Card */}
              <div className="p-5 bg-gradient-to-r from-orange-50/80 to-amber-50/50 rounded-2xl border border-orange-100 flex items-baseline gap-4">
                <span className="text-3xl md:text-4xl font-black text-shopee-orange">
                  {formatVND(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-base text-slate-400 line-through">
                    {formatVND(product.original_price)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-xs font-bold text-shopee-orange bg-white px-2.5 py-1 rounded-lg shadow-sm border border-orange-200">
                    Tiết kiệm {formatVND(product.original_price! - product.price)}
                  </span>
                )}
              </div>

              {/* Short Intro */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs font-bold text-slate-700">Số lượng:</span>
                <QuantityPicker
                  quantity={product.stock <= 0 ? 0 : quantity}
                  maxStock={product.stock}
                  onChange={setQuantity}
                  size="lg"
                />
                <span className={`text-xs ${product.stock <= 0 ? "text-rose-500 font-bold" : "text-slate-400"}`}>
                  ({product.stock > 0 ? `${product.stock} sản phẩm có sẵn` : "Sản phẩm hiện đang hết hàng"})
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95 ${
                    product.stock <= 0
                      ? "bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed"
                      : "border-2 border-shopee-orange text-shopee-orange hover:bg-orange-50"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" /> {product.stock <= 0 ? "Tạm Hết Hàng" : "Thêm Vào Giỏ Hàng"}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className={`py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95 ${
                    product.stock <= 0
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-shopee-orange to-amber-500 text-white shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30"
                  }`}
                >
                  <Zap className="w-5 h-5 fill-current" /> {product.stock <= 0 ? "Hết Hàng" : "Mua Ngay"}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex items-center gap-2 text-xs font-bold transition px-3 py-1.5 rounded-xl ${
                    isFav
                      ? "text-rose-500 bg-rose-50"
                      : "text-slate-600 hover:text-rose-500 hover:bg-slate-50"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500" : ""}`} />
                  <span>{isFav ? "Đã thêm vào Yêu Thích" : "Lưu vào Yêu Thích"}</span>
                </button>

                <Link
                  href="/appointments"
                  className="text-xs font-bold text-shopee-orange hover:underline flex items-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5" /> Hẹn thử sản phẩm tại Showroom
                </Link>
              </div>
            </div>

            {/* Commitments Bar */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-[11px] text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-shopee-orange flex-shrink-0" />
                <span>Freeship từ 200k</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-shopee-orange flex-shrink-0" />
                <span>100% Chính hãng</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-shopee-orange flex-shrink-0" />
                <span>Đổi trả 7 ngày</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Details */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-3 text-sm font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("desc")}
              className={`pb-2 transition relative ${
                activeTab === "desc"
                  ? "text-shopee-orange border-b-2 border-shopee-orange"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Mô Tả Sản Phẩm
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`pb-2 transition relative ${
                activeTab === "specs"
                  ? "text-shopee-orange border-b-2 border-shopee-orange"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Thông Số & Bảng Size
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("policy")}
              className={`pb-2 transition relative ${
                activeTab === "policy"
                  ? "text-shopee-orange border-b-2 border-shopee-orange"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Chính Sách Đổi Trả & Bảo Hành
            </button>
          </div>

          <div className="text-sm text-slate-700 leading-relaxed">
            {activeTab === "desc" && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <p>
                  Sản phẩm được tuyển chọn kỹ lưỡng, kiểm duyệt chất lượng từng đường kim mũi chỉ trước khi đóng gói gửi tới tay khách hàng.
                </p>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="space-y-3">
                <table className="w-full max-w-lg text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <tbody>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <td className="p-3 font-bold text-slate-600 w-1/3">Danh Mục</td>
                      <td className="p-3 font-semibold text-slate-800">{product.category_name}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 font-bold text-slate-600">Thương Hiệu</td>
                      <td className="p-3 font-semibold text-slate-800">MiniShop Selection</td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <td className="p-3 font-bold text-slate-600">Xuất Xứ</td>
                      <td className="p-3 font-semibold text-slate-800">Việt Nam</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-600">Tình Trạng Kho</td>
                      <td className="p-3 font-semibold text-emerald-600">{product.stock} có sẵn</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "policy" && (
              <div className="space-y-3 text-xs">
                <p>
                  <strong>• Điều kiện đổi trả:</strong> Sản phẩm còn nguyên tem mác, chưa qua giặt tẩy hoặc sử dụng làm biến dạng, trong vòng 7 ngày kể từ ngày nhận hàng.
                </p>
                <p>
                  <strong>• Bảo hành điện tử:</strong> Đổi mới 1-1 trong 30 ngày nếu phát sinh lỗi từ nhà sản xuất.
                </p>
                <p>
                  <strong>• Showroom Support:</strong> Khách hàng có thể mang trực tiếp sản phẩm đến hệ thống Showroom MiniShop để được nhân viên hỗ trợ nhanh nhất.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
            <MessageSquare className="w-5 h-5 text-shopee-orange" />
            <h2>Đánh Giá Từ Khách Hàng Đã Mua ({reviews.length})</h2>
          </div>

          <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 flex flex-col md:flex-row items-center gap-8">
            <div className="text-center space-y-1">
              <span className="text-4xl font-black text-shopee-orange">
                {product.rating_avg.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500 block font-semibold">trên 5.0</span>
              <RatingStars rating={product.rating_avg} size="lg" />
            </div>

            <div className="flex-1 w-full space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-12 text-slate-600 font-semibold">5 sao</span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[90%]" />
                </div>
                <span className="text-slate-400 w-8 text-right">90%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-slate-600 font-semibold">4 sao</span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[10%]" />
                </div>
                <span className="text-slate-400 w-8 text-right">10%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-slate-600 font-semibold">3 sao</span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[0%]" />
                </div>
                <span className="text-slate-400 w-8 text-right">0%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          rev.user_avatar ||
                          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"
                        }
                        alt={rev.user_name}
                        className="w-8 h-8 rounded-full object-cover border border-orange-200"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{rev.user_name}</p>
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Đã mua hàng tại shop
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">{formatDate(rev.created_at)}</span>
                  </div>

                  <RatingStars rating={rev.rating} size="sm" />
                  <p className="text-xs text-slate-700 leading-relaxed pt-1">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">
                Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên mua và chia sẻ cảm nhận nhé!
              </p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Sản Phẩm Tương Tự</h2>
              <Link href={`/products?category_id=${product.category_id}`} className="text-xs font-bold text-shopee-orange hover:underline">
                Xem thêm
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
