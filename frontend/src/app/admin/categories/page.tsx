"use client";

import React, { useEffect, useState } from "react";
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

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
    setImageUrl("");
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black text-slate-900 sm:text-2xl sm:gap-2.5">
            <Layers className="h-5 w-5 shrink-0 text-shopee-orange sm:h-6 sm:w-6" />
            <span>Quản Lý Danh Mục Sản Phẩm</span>
          </h1>

          <p className="mt-1 text-[11px] leading-5 text-slate-500 sm:text-xs">
            Phân loại hàng hóa giúp khách hàng tìm kiếm sản phẩm dễ dàng hơn
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex w-fit items-center gap-2 self-start rounded-xl bg-shopee-orange px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-shopee-hover active:scale-95 sm:self-auto sm:px-5"
        >
          <Plus className="h-4 w-4" />
          Thêm Danh Mục Mới
        </button>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {categories.map((cat) => {
          const expanded = expandedId === cat.id;

          return (
            <article
              key={cat.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="h-14 w-14 shrink-0 rounded-2xl border border-slate-200 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-black leading-5 text-slate-900">
                          {cat.name}
                        </h3>
                        <p className="mt-1 break-all font-mono text-[11px] text-slate-400">
                          /{cat.slug}
                        </p>
                      </div>

                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">
                        <Package className="h-3 w-3 text-shopee-orange" />
                        {cat.product_count || 0}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">
                      {cat.description || "Chưa có mô tả cho danh mục này."}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : cat.id)}
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
                    onClick={() => handleOpenEdit(cat)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-orange-50 px-3 py-2.5 text-xs font-bold text-shopee-orange transition hover:bg-orange-100"
                  >
                    <Edit2 className="h-4 w-4" />
                    Sửa
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingId(cat.id)}
                    className="flex items-center justify-center rounded-xl bg-rose-50 p-2.5 text-rose-600 transition hover:bg-rose-100"
                    aria-label={`Xóa ${cat.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {expanded && (
                <div className="border-t border-slate-100 bg-slate-50/60 p-4 text-xs">
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Đường dẫn (slug)
                      </p>
                      <p className="mt-1 break-all font-mono text-slate-700">
                        {cat.slug}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Mô tả
                      </p>
                      <p className="mt-1 leading-5 text-slate-700">
                        {cat.description || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Số sản phẩm
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {cat.product_count || 0} sản phẩm
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase tracking-wider text-slate-500">
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
                <tr key={cat.id} className="transition hover:bg-slate-50/50">
                  <td className="p-4">
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="h-12 w-12 rounded-2xl border border-slate-200 object-cover"
                    />
                  </td>

                  <td className="p-4 text-sm font-bold text-slate-900">
                    {cat.name}
                  </td>

                  <td className="p-4 font-mono text-slate-500">{cat.slug}</td>

                  <td className="max-w-xs truncate p-4 text-slate-600">
                    {cat.description || "—"}
                  </td>

                  <td className="p-4">
                    <span className="flex w-max items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                      <Package className="h-3 w-3 text-shopee-orange" />
                      {cat.product_count || 0} sản phẩm
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cat)}
                        className="rounded-xl p-2 text-slate-600 transition hover:bg-orange-50 hover:text-shopee-orange"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingId(cat.id)}
                        className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
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
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-slate-100 bg-white p-4 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-5 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-4 sm:-mx-6 sm:-mt-6 sm:px-6">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                <Layers className="h-5 w-5 text-shopee-orange" />
                <span>
                  {editingCategory ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}
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
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Tên danh mục (*)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Thời Trang Nam, Đồ Công Nghệ..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Slug URL</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="thoi-trang-nam"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-shopee-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Hình Ảnh Danh Mục (*)
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        if (file.size > 2 * 1024 * 1024) {
                          toast.error(
                            "Kích thước ảnh quá lớn, vui lòng chọn ảnh < 2MB"
                          );
                          return;
                        }

                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImageUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full min-w-0 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-shopee-orange file:mr-3 file:rounded-full file:border-0 file:bg-orange-50 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-shopee-orange hover:file:bg-orange-100"
                  />

                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="h-14 w-14 shrink-0 rounded-xl border border-slate-200 object-cover sm:h-10 sm:w-10"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Mô tả ngắn
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả các mặt hàng thuộc nhóm này..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 focus:outline-none focus:ring-2 focus:ring-shopee-orange"
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
