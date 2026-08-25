"use client";

import React, { useState, useEffect } from "react";
import { StorageService } from "@/lib/storage";
import { Appointment, AppointmentStatus } from "@/types";
import { formatDateOnly, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  Calendar,
  CheckCircle2,
  Clock,
  CheckCheck,
  XCircle,
  Users,
} from "lucide-react";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = () => {
    StorageService.init();
    setAppointments(StorageService.getAppointments());
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = (id: number, status: AppointmentStatus) => {
    try {
      StorageService.updateAppointmentStatus(id, status);
      toast.success(`Đã cập nhật trạng thái lịch hẹn #${id} thành ${status}!`);
      fetchAppointments();
    } catch (err: any) {
      toast.error(err.message || "Lỗi cập nhật lịch hẹn");
    }
  };

  const statusMap: Record<
    AppointmentStatus,
    { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    PENDING: { label: "Chờ Tiếp Đón", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
    CONFIRMED: { label: "Đã Xác Nhận", color: "bg-blue-50 text-blue-700 border-blue-200", icon: CheckCircle2 },
    COMPLETED: { label: "Đã Hoàn Thành", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCheck },
    CANCELLED: { label: "Đã Hủy", color: "bg-rose-50 text-rose-700 border-rose-200", icon: XCircle },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <Calendar className="w-6 h-6 text-shopee-orange" />
          <span>Quản Lý Lịch Hẹn Showroom</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Duyệt và tiếp đón khách hàng đăng ký trải nghiệm thử đồ và thiết bị trực tiếp tại Showroom
        </p>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Khách Hàng / SĐT</th>
                <th className="p-4">Ngày & Khung Giờ</th>
                <th className="p-4">Dịch Vụ Trải Nghiệm</th>
                <th className="p-4">Số Người</th>
                <th className="p-4">Ghi Chú</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-right">Thao Tác Nhanh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((app) => {
                const status = statusMap[app.status] || statusMap.PENDING;
                const StatusIcon = status.icon;

                return (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <p className="font-bold text-slate-900 text-sm">{app.user_name || "Khách Hàng"}</p>
                      <span className="text-[11px] text-slate-400">{app.user_phone || "0987654321"}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{formatDateOnly(app.appointment_date)}</p>
                      <span className="text-[11px] text-shopee-orange font-semibold">{app.appointment_time}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700 max-w-xs">{app.service_type}</td>
                    <td className="p-4">
                      <span className="font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {app.guest_count} người
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 max-w-xs italic truncate">
                      {app.note || "—"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold border ${status.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        <span>{status.label}</span>
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {app.status === "PENDING" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(app.id, "CONFIRMED")}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl transition"
                          >
                            Xác nhận
                          </button>
                        )}
                        {app.status === "CONFIRMED" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(app.id, "COMPLETED")}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl transition"
                          >
                            Hoàn thành
                          </button>
                        )}
                        {app.status !== "CANCELLED" && app.status !== "COMPLETED" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(app.id, "CANCELLED")}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                            title="Hủy lịch hẹn"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
