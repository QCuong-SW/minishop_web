"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shared/ProductCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProductGridSkeleton } from "@/components/shared/LoadingSkeleton";
import { StorageService } from "@/lib/storage";
import { Product, Category } from "@/types";
import {
  Filter,
  SlidersHorizontal,
  ChevronRight,
  RotateCcw,
  Search,
  Star,
  Layers,
} from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const initialCategory = searchParams.get("category_id") ? Number(searchParams.get("category_id")) : undefined;
  const initialKeyword = searchParams.get("keyword") || "";
  const initialSort = (searchParams.get("sort") as any) || "newest";

  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(initialCategory);
  const [keyword, setKeyword] = useState<string>(initialKeyword);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState<string>(initialSort);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  useEffect(() => {
    StorageService.init();
    setCategories(StorageService.getCategories());
  }, []);

  useEffect(() => {
    setSelectedCategory(
      searchParams.get("category_id") ? Number(searchParams.get("category_id")) : undefined
    );
    setKeyword(searchParams.get("keyword") || "");
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const { items } = StorageService.getProducts({
        category_id: selectedCategory,
        keyword: keyword,
        min_price: minPrice ? Number(minPrice) : undefined,
        max_price: maxPrice ? Number(maxPrice) : undefined,
        rating: minRating,
        sort: sort as any,
      });
      setProducts(items);
      setCurrentPage(1);
      setLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [selectedCategory, keyword, minPrice, maxPrice, minRating, sort]);

  const handleResetFilters = () => {
    setSelectedCategory(undefined);
    setKeyword("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating(undefined);
    setSort("newest");
    router.push("/products");
  };

  // Pagination calculation
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => router.push("/")} className="hover:text-shopee-orange">
            Trang chủ
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800">Khám Phá Sản Phẩm</span>
          {selectedCategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-bold text-shopee-orange">
                {categories.find((c) => c.id === selectedCategory)?.name}
              </span>
            </>
          )}
          {keyword && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-bold text-slate-700">Từ khóa: &quot;{keyword}&quot;</span>
            </>
          )}
        </div>

        {/* Layout Grid: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filter Component */}
          <aside className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-shopee-orange" />
                  <span>Bộ Lọc Tìm Kiếm</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-shopee-orange hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Thiết lập lại
                </button>
              </div>

              {/* Category Filter */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" /> Theo Danh Mục
                </h4>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(undefined)}
                    className={`w-full text-left text-xs px-3 py-2 rounded-xl font-medium transition flex items-center justify-between ${
                      selectedCategory === undefined
                        ? "bg-orange-50 text-shopee-orange font-bold border border-orange-200"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>Tất cả danh mục</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left text-xs px-3 py-2 rounded-xl font-medium transition flex items-center justify-between ${
                        selectedCategory === cat.id
                          ? "bg-orange-50 text-shopee-orange font-bold border border-orange-200"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({cat.product_count || 0})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Khoảng Giá (VNĐ)
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Từ đ"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-shopee-orange"
                  />
                  <input
                    type="number"
                    placeholder="Đến đ"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-shopee-orange"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice("0");
                      setMaxPrice("200000");
                    }}
                    className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-orange-50 hover:text-shopee-orange rounded-md transition font-medium text-slate-600"
                  >
                    Dưới 200k
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice("200000");
                      setMaxPrice("500000");
                    }}
                    className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-orange-50 hover:text-shopee-orange rounded-md transition font-medium text-slate-600"
                  >
                    200k - 500k
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice("500000");
                      setMaxPrice("");
                    }}
                    className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-orange-50 hover:text-shopee-orange rounded-md transition font-medium text-slate-600"
                  >
                    Trên 500k
                  </button>
                </div>
              </div>

              {/* Rating Star Filter */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Đánh Giá Sao
                </h4>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setMinRating(undefined)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-xl transition ${
                      minRating === undefined
                        ? "bg-orange-50 text-shopee-orange font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Tất cả đánh giá
                  </button>
                  <button
                    type="button"
                    onClick={() => setMinRating(5)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                      minRating === 5
                        ? "bg-orange-50 text-shopee-orange font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span>(Từ 5 sao)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMinRating(4.5)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                      minRating === 4.5
                        ? "bg-orange-50 text-shopee-orange font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex text-amber-400">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                      <Star className="w-3.5 h-3.5 text-slate-200 fill-slate-100" />
                    </div>
                    <span>(Từ 4.5 sao)</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Product Listing Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Topbar Controls */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-lg font-black text-slate-900">
                  {selectedCategory
                    ? categories.find((c) => c.id === selectedCategory)?.name
                    : "Tất Cả Sản Phẩm"}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tìm thấy <strong className="text-shopee-orange">{products.length}</strong> sản phẩm phù hợp
                </p>
              </div>

              {/* Sort Control */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                  Sắp xếp:
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-shopee-orange"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="sold_desc">Bán chạy nhất</option>
                  <option value="price_asc">Giá: Thấp đến Cao</option>
                  <option value="price_desc">Giá: Cao đến Thấp</option>
                  <option value="rating_desc">Đánh giá cao nhất</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <ProductGridSkeleton count={itemsPerPage} />
            ) : paginatedProducts.length > 0 ? (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition"
                    >
                      &larr; Trang trước
                    </button>

                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                            currentPage === pageNum
                              ? "bg-shopee-orange text-white shadow-md shadow-orange-200"
                              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition"
                    >
                      Trang sau &rarr;
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState
                title="Không tìm thấy sản phẩm nào"
                description="Rất tiếc, không có sản phẩm nào phù hợp với bộ lọc hiện tại của bạn. Hãy thử thay đổi mức giá hoặc danh mục nhé!"
                actionText="Xóa tất cả bộ lọc"
                onAction={handleResetFilters}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Đang tải danh sách sản phẩm...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
