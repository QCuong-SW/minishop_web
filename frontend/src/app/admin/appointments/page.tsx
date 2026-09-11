"use client";

import React, { useEffect, useState } from "react";
import { StorageService } from "@/lib/storage";
import { Appointment, AppointmentStatus } from "@/types";
import { formatDateOnly } from "@/lib/utils";
import { toast } from "sonner";
import {
  Calendar,
  CheckCircle2,
  Clock,
  CheckCheck,
  XCircle,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

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
    {
      label: string;
      color: string;
      icon: React.ComponentType<{ className?: string }>;
    }
  > = {
    PENDING: {
      label: "Chờ Tiếp Đón",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock,
    },
    CONFIRMED: {
      label: "Đã Xác Nhận",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: CheckCircle2,
    },
    COMPLETED: {
      label: "Đã Hoàn Thành",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCheck,
    },
    CANCELLED: {
      label: "Đã Hủy",
      color: "bg-rose-50 text-rose-700 border-rose-200",
      icon: XCircle,
    },
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-xl font-black text-slate-900 sm:text-2xl sm:gap-2.5">
          <Calendar className="h-5 w-5 shrink-0 text-shopee-orange sm:h-6 sm:w-6" />
          <span>Quản Lý Lịch Hẹn Showroom</span>
        </h1>

        <p className="mt-1 max-w-2xl text-[11px] leading-5 text-slate-500 sm:text-xs">
          Duyệt và tiếp đón khách hàng đăng ký trải nghiệm thử đồ và thiết bị trực tiếp tại Showroom
        </p>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {appointments.map((app) => {
          const status = statusMap[app.status] || statusMap.PENDING;
          const StatusIcon = status.icon;
          const expanded = expandedId === app.id;

          return (
            <article
              key={app.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-slate-900">
                      {app.user_name || "Khách Hàng"}
                    </h3>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {app.user_phone || "0987654321"}
                    </p>
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${status.color}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Ngày & giờ
                    </p>
                    <p className="mt-1 text-xs font-bold text-slate-800">
                      {formatDateOnly(app.appointment_date)}
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold text-shopee-orange">
                      {app.appointment_time}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Số người
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-800">
                      <Users className="h-3.5 w-3.5 text-shopee-orange" />
                      {app.guest_count} người
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Dịch vụ trải nghiệm
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-slate-700">
                    {app.service_type}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : app.id)}
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

                  {app.status === "PENDING" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(app.id, "CONFIRMED")}
                      className="rounded-xl bg-blue-50 px-3 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                    >
                      Xác nhận
                    </button>
                  )}

                  {app.status === "CONFIRMED" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(app.id, "COMPLETED")}
                      className="rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      Hoàn thành
                    </button>
                  )}

                  {app.status !== "CANCELLED" && app.status !== "COMPLETED" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(app.id, "CANCELLED")}
                      className="rounded-xl bg-rose-50 p-2.5 text-rose-600 transition hover:bg-rose-100"
                      aria-label="Hủy lịch hẹn"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {expanded && (
                <div className="border-t border-slate-100 bg-slate-50/60 p-4 text-xs">
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Dịch vụ
                      </p>
                      <p className="mt-1 font-semibold leading-5 text-slate-700">
                        {app.service_type}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Ghi chú
                      </p>
                      <p className="mt-1 leading-5 text-slate-600">
                        {app.note || "Không có ghi chú."}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Trạng thái
                      </p>
                      <span
                        className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${status.color}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
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
                  <tr key={app.id} className="transition hover:bg-slate-50/50">
                    <td className="p-4">
                      <p className="text-sm font-bold text-slate-900">
                        {app.user_name || "Khách Hàng"}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        {app.user_phone || "0987654321"}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-800">
                        {formatDateOnly(app.appointment_date)}
                      </p>
                      <span className="text-[11px] font-semibold text-shopee-orange">
                        {app.appointment_time}
                      </span>
                    </td>

                    <td className="max-w-xs p-4 font-semibold text-slate-700">
                      {app.service_type}
                    </td>

                    <td className="p-4">
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-bold text-slate-700">
                        {app.guest_count} người
                      </span>
                    </td>

                    <td className="max-w-xs truncate p-4 italic text-slate-500">
                      {app.note || "—"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-bold ${status.color}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        <span>{status.label}</span>
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {app.status === "PENDING" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateStatus(app.id, "CONFIRMED")
                            }
                            className="rounded-xl bg-blue-50 px-3 py-1.5 font-bold text-blue-700 transition hover:bg-blue-100"
                          >
                            Xác nhận
                          </button>
                        )}

                        {app.status === "CONFIRMED" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateStatus(app.id, "COMPLETED")
                            }
                            className="rounded-xl bg-emerald-50 px-3 py-1.5 font-bold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            Hoàn thành
                          </button>
                        )}

                        {app.status !== "CANCELLED" &&
                          app.status !== "COMPLETED" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateStatus(app.id, "CANCELLED")
                              }
                              className="rounded-xl p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                              title="Hủy lịch hẹn"
                            >
                              <XCircle className="h-4 w-4" />
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
