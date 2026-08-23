"use client";

import React, { useState, useEffect } from "react";
import { StorageService } from "@/lib/storage";
import { Category } from "@/types";
import { slugify } from "@/lib/utils";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { toast } from "sonner";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  X,
  Package,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const fetchCategories = () => {
    StorageService.init();
    setCategories(StorageService.getCategories());
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setImageUrl(cat.image_url || "");
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(slugify(val));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên danh mục!");
      return;
    }

    try {
      StorageService.saveCategory({
        id: editingCategory ? editingCategory.id : undefined,
        name: name.trim(),
        slug: slug.trim() || slugify(name.trim()),
        description: description.trim(),
        image_url:
          imageUrl.trim() ||
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
      });

      toast.success(
        editingCategory
          ? "Đã cập nhật danh mục thành công!"
          : "Đã tạo danh mục mới!"
      );
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || "Lỗi lưu danh mục");
    }
  };

  const handleDelete = (id: number) => {
    try {
      StorageService.deleteCategory(id);
      toast.success("Đã xóa danh mục!");
      setDeletingId(null);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || "Không thể xóa danh mục này");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            📁 Quản Lý Danh Mục Sản Phẩm
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Phân loại hàng hóa giúp khách hàng tìm kiếm sản phẩm dễ dàng hơn
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-shopee-orange text-white font-bold text-xs rounded-xl shadow-md hover:bg-shopee-hover flex items-center gap-2 transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Thêm Danh Mục Mới
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Hình Ảnh</th>
                <th className="p-4">Tên Danh Mục</th>
                <th className="p-4">Đường Dẫn (Slug)</th>
                <th className="p-4">Mô Tả</th>
                <th className="p-4">Số Sản Phẩm</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                  </td>
                  <td className="p-4 font-bold text-slate-900 text-sm">{cat.name}</td>
                  <td className="p-4 font-mono text-slate-500">{cat.slug}</td>
                  <td className="p-4 text-slate-600 max-w-xs truncate">
                    {cat.description || "—"}
                  </td>
                  <td className="p-4">
                    <span className="font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] flex items-center gap-1 w-max">
                      <Package className="w-3 h-3 text-shopee-orange" />
                      {cat.product_count || 0} sản phẩm
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cat)}
                        className="p-2 text-slate-600 hover:text-shopee-orange hover:bg-orange-50 rounded-xl transition"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(cat.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-shopee-orange" />
                <span>{editingCategory ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}</span>
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
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Tên danh mục (*)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Thời Trang Nam, Đồ Công Nghệ..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Slug URL</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="thoi-trang-nam"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Link Ảnh Đại Diện (*)</label>
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
                <label className="font-bold text-slate-700 block">Mô tả ngắn</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả các mặt hàng thuộc nhóm này..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange resize-none"
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
                  {editingCategory ? "Lưu Thay Đổi" : "Tạo Danh Mục"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deletingId !== null}
        title="Xác nhận xóa danh mục?"
        message="Bạn có chắc chắn muốn xóa danh mục này? Lưu ý: Không thể xóa danh mục nếu đang có sản phẩm trực thuộc."
        confirmText="Xóa Danh Mục"
        onConfirm={() => deletingId && handleDelete(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
