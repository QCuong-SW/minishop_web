"use client";

import React, { useEffect, useState } from "react";
import { getMiniShopChangedKey, MINISHOP_DATA_CHANGE_EVENT, StorageService } from "@/lib/storage";
import { Product, Category } from "@/types";
import { formatVND, slugify } from "@/lib/utils";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [keyword, setKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>(undefined);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState<number>(1);
  const [price, setPrice] = useState<number | string>("");
  const [originalPrice, setOriginalPrice] = useState<number | string>("");
  const [stock, setStock] = useState<number | string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  const fetchProducts = () => {
    StorageService.init();
    setCategories(StorageService.getCategories());
    const { items } = StorageService.getProducts({
      keyword,
      category_id: categoryFilter,
    });
    setProducts(items);
  };

  useEffect(() => {
    fetchProducts();

    const refreshProducts = (event: Event) => {
      const key = getMiniShopChangedKey(event);
      if (key.includes("products") || key.includes("categories") || key.includes("reviews")) {
        fetchProducts();
      }
    };
    window.addEventListener(MINISHOP_DATA_CHANGE_EVENT, refreshProducts);
    window.addEventListener("storage", refreshProducts);
    return () => {
      window.removeEventListener(MINISHOP_DATA_CHANGE_EVENT, refreshProducts);
      window.removeEventListener("storage", refreshProducts);
    };
  }, [keyword, categoryFilter]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName("");
    setSlug("");
    setCategoryId(categories.length ? categories[0].id : 1);
    setPrice(150000);
    setOriginalPrice(200000);
    setStock(50);
    setImageUrl("");
    setDescription("");
    setStatus("ACTIVE");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSlug(p.slug);
    setCategoryId(p.category_id);
    setPrice(p.price);
    setOriginalPrice(p.original_price || p.price);
    setStock(p.stock);
    setImageUrl(p.image_url);
    setDescription(p.description || "");
    setStatus(p.status);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingProduct) {
      setSlug(slugify(val));
    }
  };

  const handleImageUpload = async (file?: File) => {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Kích thước ảnh quá lớn, vui lòng chọn ảnh < 2MB");
      return;
    }

    try {
      setIsUploadingImage(true);
      const uploadedUrl = await uploadImageToCloudinary(file);
      setImageUrl(uploadedUrl);
      toast.success("Đã tải ảnh lên Cloudinary!");
    } catch (err: any) {
      toast.error(err.message || "Không thể tải ảnh lên Cloudinary");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !price) {
      toast.error("Vui lòng nhập đầy đủ tên sản phẩm và giá bán!");
      return;
    }

    try {
      StorageService.saveProduct({
        id: editingProduct ? editingProduct.id : undefined,
        name: name.trim(),
        slug: slug.trim() || slugify(name.trim()),
        category_id: Number(categoryId),
        price: Number(price),
        original_price: Number(originalPrice) || Number(price),
        stock: Number(stock) || 0,
        image_url:
          imageUrl.trim() ||
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
        description: description.trim(),
        status,
      });

      toast.success(
        editingProduct
          ? "Đã cập nhật sản phẩm thành công!"
          : "Đã thêm sản phẩm mới vào danh mục!"
      );

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || "Lỗi lưu sản phẩm");
    }
  };

  const handleDelete = (id: number) => {
    try {
      StorageService.deleteProduct(id);
      toast.success("Đã xóa sản phẩm khỏi hệ thống!");
      setDeletingId(null);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || "Lỗi xóa sản phẩm");
    }
  };

  const stockClass = (stockValue: number) => {
    if (stockValue <= 10) return "bg-rose-50 text-rose-600 border border-rose-200";
    if (stockValue <= 45) return "bg-amber-50 text-amber-700 border border-amber-200";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black text-slate-900 sm:text-2xl sm:gap-2.5">
            <Package className="h-5 w-5 shrink-0 text-shopee-orange sm:h-6 sm:w-6" />
            <span>Quản Lý Sản Phẩm</span>
          </h1>

          <p className="mt-1 text-[11px] leading-5 text-slate-500 sm:text-xs">
            Danh sách tất cả sản phẩm đang kinh doanh trên hệ thống
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex w-fit items-center gap-2 self-start rounded-xl bg-shopee-orange px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-shopee-hover active:scale-95 sm:self-auto sm:px-5"
        >
          <Plus className="h-4 w-4" />
          Thêm Sản Phẩm Mới
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm theo tên sản phẩm..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-shopee-orange"
            />
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          <select
            value={categoryFilter || ""}
            onChange={(e) =>
              setCategoryFilter(e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-shopee-orange sm:w-56"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Product Cards */}
      <div className="space-y-3 md:hidden">
        {products.length > 0 ? (
          products.map((p) => {
            const expanded = expandedId === p.id;

            return (
              <article
                key={p.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="h-16 w-16 shrink-0 rounded-2xl border border-slate-200 object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-sm font-black leading-5 text-slate-900">
                            {p.name}
                          </h3>
                          <p className="mt-1 truncate font-mono text-[10px] text-slate-400">
                            /{p.slug}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            p.status === "ACTIVE"
                              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {p.status === "ACTIVE" ? "Kích hoạt" : "Ẩn"}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-shopee-orange">
                          {formatVND(p.price)}
                        </span>

                        {p.original_price && p.original_price > p.price && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {formatVND(p.original_price)}
                          </span>
                        )}

                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${stockClass(
                            p.stock
                          )}`}
                        >
                          Kho: {p.stock}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : p.id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                    >
                      {expanded ? (
                        <>
                          Thu gọn <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Xem thêm <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(p)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-orange-50 px-3 py-2.5 text-xs font-bold text-shopee-orange transition hover:bg-orange-100"
                    >
                      <Edit2 className="h-4 w-4" />
                      Sửa
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingId(p.id)}
                      className="flex items-center justify-center rounded-xl bg-rose-50 p-2.5 text-rose-600 transition hover:bg-rose-100"
                      aria-label={`Xóa ${p.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {expanded && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Danh mục
                        </p>
                        <p className="mt-1 font-bold text-slate-900">
                          {p.category_name || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Tồn kho
                        </p>
                        <p className="mt-1 font-bold text-slate-900">
                          {p.stock} sản phẩm
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Slug
                      </p>
                      <p className="mt-1 break-all font-mono text-slate-700">
                        {p.slug}
                      </p>
                    </div>

                    <div className="mt-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Mô tả
                      </p>
                      <p className="mt-1 leading-5 text-slate-700">
                        {p.description || "Chưa có mô tả."}
                      </p>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400 shadow-sm">
            Không tìm thấy sản phẩm nào.
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase tracking-wider text-slate-500">
                <th className="p-4">Hình Ảnh</th>
                <th className="p-4">Tên Sản Phẩm</th>
                <th className="p-4">Danh Mục</th>
                <th className="p-4">Giá Bán</th>
                <th className="p-4">Tồn Kho</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {products.length > 0 ? (
                products.map((p) => (
                  <tr key={p.id} className="transition hover:bg-slate-50/50">
                    <td className="p-4">
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-12 w-12 rounded-xl border border-slate-200 object-cover"
                      />
                    </td>

                    <td className="p-4">
                      <p className="max-w-xs truncate text-sm font-bold text-slate-900">
                        {p.name}
                      </p>
                      <span className="font-mono text-[10px] text-slate-400">
                        /{p.slug}
                      </span>
                    </td>

                    <td className="p-4 font-semibold text-slate-600">
                      {p.category_name}
                    </td>

                    <td className="p-4">
                      <span className="block font-black text-shopee-orange">
                        {formatVND(p.price)}
                      </span>

                      {p.original_price && p.original_price > p.price && (
                        <span className="text-[10px] text-slate-400 line-through">
                          {formatVND(p.original_price)}
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-md px-2 py-0.5 font-bold ${stockClass(
                          p.stock
                        )}`}
                      >
                        {p.stock} cái
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          p.status === "ACTIVE"
                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {p.status === "ACTIVE" ? "Kích Hoạt" : "Ẩn"}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="rounded-xl p-2 text-slate-600 transition hover:bg-orange-50 hover:text-shopee-orange"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingId(p.id)}
                          className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-slate-100 bg-white p-4 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-5 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-4 sm:-mx-6 sm:-mt-6 sm:px-6">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                <Package className="h-5 w-5 text-shopee-orange" />
                <span>
                  {editingProduct ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
                </span>
              </h2>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Tên sản phẩm (*)
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Áo thun cotton, Bàn phím cơ..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Slug URL
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="ao-thun-cotton"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Danh mục (*)
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Giá bán (VNĐ) (*)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-bold text-shopee-orange focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Giá gốc
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Số lượng tồn kho (*)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Trạng thái bán (*)
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE")}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                  >
                    <option value="ACTIVE">Kích hoạt (Đang bán)</option>
                    <option value="INACTIVE">Tạm ẩn (Không hiển thị)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Hình Ảnh Sản Phẩm (*)
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingImage}
                    onChange={(e) => handleImageUpload(e.target.files?.[0])}
                    className="w-full min-w-0 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-shopee-orange file:mr-3 file:rounded-full file:border-0 file:bg-orange-50 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-shopee-orange hover:file:bg-orange-100"
                  />

                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Ảnh xem trước"
                      className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 object-cover sm:h-10 sm:w-10"
                    />
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  {isUploadingImage
                    ? "Đang tải ảnh lên Cloudinary..."
                    : imageUrl
                      ? "Database sẽ chỉ lưu URL ảnh Cloudinary."
                      : "Chọn ảnh để tải lên Cloudinary, hệ thống sẽ tự lấy URL."}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Mô tả sản phẩm chi tiết
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Chất liệu, kiểu dáng, xuất xứ..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3.5 focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                />
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-shopee-orange px-6 py-2.5 text-xs font-bold text-white shadow transition hover:bg-shopee-hover active:scale-95 sm:w-auto"
                >
                  {editingProduct ? "Lưu Thay Đổi" : "Thêm Sản Phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deletingId !== null}
        title="Xác nhận xóa sản phẩm?"
        message="Bạn có chắc chắn muốn xóa sản phẩm này khỏi cơ sở dữ liệu? Dữ liệu đã xóa không thể khôi phục."
        confirmText="Xóa Sản Phẩm"
        onConfirm={() => deletingId && handleDelete(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
