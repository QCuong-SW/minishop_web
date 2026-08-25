"use client";

import React, { useState, useEffect } from "react";
import { StorageService } from "@/lib/storage";
import { Product, Category } from "@/types";
import { formatVND, slugify } from "@/lib/utils";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { toast } from "sonner";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
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

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState<number>(1);
  const [price, setPrice] = useState<number | string>("");
  const [originalPrice, setOriginalPrice] = useState<number | string>("");
  const [stock, setStock] = useState<number | string>("");
  const [imageUrl, setImageUrl] = useState("");
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
  }, [keyword, categoryFilter]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName("");
    setSlug("");
    setCategoryId(categories.length ? categories[0].id : 1);
    setPrice(150000);
    setOriginalPrice(200000);
    setStock(50);
    setImageUrl("https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600");
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Package className="w-6 h-6 text-shopee-orange" />
            <span>Quản Lý Sản Phẩm</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Danh sách tất cả sản phẩm đang kinh doanh trên hệ thống
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-shopee-orange text-white font-bold text-xs rounded-xl shadow-md hover:bg-shopee-hover flex items-center gap-2 transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Thêm Sản Phẩm Mới
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm theo tên sản phẩm..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={categoryFilter || ""}
          onChange={(e) =>
            setCategoryFilter(e.target.value ? Number(e.target.value) : undefined)
          }
          className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-shopee-orange"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
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
                  <tr key={p.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900 text-sm max-w-xs truncate">{p.name}</p>
                      <span className="font-mono text-[10px] text-slate-400">/{p.slug}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-600">{p.category_name}</td>
                    <td className="p-4">
                      <span className="font-black text-shopee-orange block">
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
                        className={`font-bold px-2 py-0.5 rounded-md ${
                          p.stock <= 10
                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                            : p.stock <= 45
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {p.stock} cái
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-bold px-2.5 py-1 rounded-full text-[10px] ${
                          p.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
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
                          className="p-2 text-slate-600 hover:text-shopee-orange hover:bg-orange-50 rounded-xl transition"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(p.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-shopee-orange" />
                <span>{editingProduct ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Tên sản phẩm (*)</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Áo thun cotton, Bàn phím cơ..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Slug URL</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="ao-thun-cotton"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Danh mục (*)</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange font-bold text-slate-800"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Giá bán (VNĐ) (*)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange font-bold text-shopee-orange"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Giá gốc (Gạch ngang)</label>
                  <input
                    type="number"
                    min={0}
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Số lượng tồn kho (*)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Trạng thái bán (*)</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange font-bold"
                  >
                    <option value="ACTIVE">Kích hoạt (Đang bán)</option>
                    <option value="INACTIVE">Tạm ẩn (Không hiển thị)</option>
                  </select>
                </div>
              </div>

              {/* Image URL & Live Preview */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Link Ảnh URL (*)</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                  />
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Mô tả sản phẩm chi tiết</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Chất liệu, kiểu dáng, xuất xứ..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-shopee-orange text-white font-bold text-xs rounded-xl shadow hover:bg-shopee-hover transition active:scale-95"
                >
                  {editingProduct ? "Lưu Thay Đổi" : "Thêm Sản Phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
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
