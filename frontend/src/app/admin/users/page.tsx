"use client";

import React, { useState, useEffect } from "react";
import { StorageService } from "@/lib/storage";
import { User } from "@/types";
import { formatDate } from "@/lib/utils";
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
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          👥 Quản Lý Khách Hàng & Tài Khoản
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Danh sách người dùng đã đăng ký thành viên trên hệ thống Shopee Mini
        </p>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
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
                <tr key={u.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          u.avatar_url ||
                          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"
                        }
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                        <span className="text-[10px] text-slate-400">ID: #{u.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{u.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{u.phone || "—"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 max-w-xs truncate">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{u.address || "Chưa cập nhật"}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        u.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {u.role === "ADMIN" ? (
                        <>
                          <ShieldCheck className="w-3 h-3" /> Quản Trị Viên
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3 h-3" /> Khách Hàng
                        </>
                      )}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`font-bold px-2.5 py-1 rounded-full text-[10px] ${
                        u.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
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
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 flex items-center gap-1.5 ml-auto ${
                          u.status === "ACTIVE"
                            ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {u.status === "ACTIVE" ? (
                          <>
                            <Ban className="w-3.5 h-3.5" /> Khóa
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mở Khóa
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
