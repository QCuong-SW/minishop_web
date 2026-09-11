"use client";

import React, { useEffect, useState } from "react";
import { StorageService } from "@/lib/storage";
import { User } from "@/types";
import { toast } from "sonner";
import {
  Users,
  ShieldCheck,
  UserCheck,
  Ban,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchUsers = () => {
    StorageService.init();
    setUsers(StorageService.getUsers());
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = (userId: number, currentStatus: string) => {
    try {
      StorageService.toggleUserStatus(userId);

      toast.success(
        currentStatus === "ACTIVE"
          ? `Đã khóa tài khoản #${userId}!`
          : `Đã mở khóa tài khoản #${userId}!`
      );

      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Lỗi cập nhật trạng thái");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-xl font-black text-slate-900 sm:text-2xl sm:gap-2.5">
          <Users className="h-5 w-5 shrink-0 text-shopee-orange sm:h-6 sm:w-6" />
          <span>Quản Lý Khách Hàng & Tài Khoản</span>
        </h1>

        <p className="mt-1 max-w-2xl text-[11px] leading-5 text-slate-500 sm:text-xs">
          Danh sách người dùng đã đăng ký thành viên trên hệ thống MiniShop
        </p>
      </div>

      {/* Mobile User Cards */}
      <div className="space-y-3 md:hidden">
        {users.map((u) => {
          const expanded = expandedId === u.id;
          const isAdmin = u.role === "ADMIN";
          const isActive = u.status === "ACTIVE";

          return (
            <article
              key={u.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <img
                    src={
                      u.avatar_url ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"
                    }
                    alt={u.name}
                    className="h-12 w-12 shrink-0 rounded-full border border-slate-200 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-black text-slate-900">
                          {u.name}
                        </h3>
                        <p className="mt-1 text-[10px] text-slate-400">
                          ID: #{u.id}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                          isActive
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-rose-200 bg-rose-50 text-rose-700"
                        }`}
                      >
                        {isActive ? "Hoạt động" : "Đã khóa"}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          isAdmin
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {isAdmin ? (
                          <>
                            <ShieldCheck className="h-3 w-3" />
                            Quản trị viên
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-3 w-3" />
                            Khách hàng
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="min-w-0 truncate">{u.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span>{u.phone || "Chưa cập nhật"}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : u.id)}
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

                  {!isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(u.id, u.status)}
                      className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition active:scale-95 ${
                        isActive
                          ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {isActive ? (
                        <>
                          <Ban className="h-3.5 w-3.5" />
                          Khóa
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Mở khóa
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {expanded && (
                <div className="border-t border-slate-100 bg-slate-50/60 p-4 text-xs">
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Địa chỉ giao hàng
                      </p>
                      <div className="mt-1 flex items-start gap-1.5 text-slate-700">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span className="leading-5">
                          {u.address || "Chưa cập nhật"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Vai trò
                        </p>
                        <p className="mt-1 font-bold text-slate-900">
                          {isAdmin ? "Quản trị viên" : "Khách hàng"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Trạng thái
                        </p>
                        <p className="mt-1 font-bold text-slate-900">
                          {isActive ? "Hoạt động" : "Đã bị khóa"}
                        </p>
                      </div>
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
                <th className="p-4">Thành Viên</th>
                <th className="p-4">Liên Hệ (Email & SĐT)</th>
                <th className="p-4">Địa Chỉ Giao Hàng</th>
                <th className="p-4">Vai Trò</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="transition hover:bg-slate-50/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          u.avatar_url ||
                          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"
                        }
                        alt={u.name}
                        className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {u.name}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          ID: #{u.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span>{u.email}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span>{u.phone || "—"}</span>
                      </div>
                    </div>
                  </td>

                  <td className="max-w-xs truncate p-4 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">
                        {u.address || "Chưa cập nhật"}
                      </span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        u.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {u.role === "ADMIN" ? (
                        <>
                          <ShieldCheck className="h-3 w-3" />
                          Quản Trị Viên
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-3 w-3" />
                          Khách Hàng
                        </>
                      )}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        u.status === "ACTIVE"
                          ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border border-rose-200 bg-rose-50 text-rose-700"
                      }`}
                    >
                      {u.status === "ACTIVE" ? "Hoạt Động" : "Đã Bị Khóa"}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    {u.role !== "ADMIN" && (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u.id, u.status)}
                        className={`ml-auto flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                          u.status === "ACTIVE"
                            ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {u.status === "ACTIVE" ? (
                          <>
                            <Ban className="h-3.5 w-3.5" />
                            Khóa
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Mở Khóa
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
