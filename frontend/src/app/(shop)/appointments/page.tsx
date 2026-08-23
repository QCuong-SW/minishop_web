"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EmptyState } from "@/components/shared/EmptyState";
import { StorageService } from "@/lib/storage";
import { useAuth } from "@/context/AuthContext";
import { Appointment, AppointmentStatus } from "@/types";
import { formatDateOnly, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  Users,
  Sparkles,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Building,
} from "lucide-react";

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<"book" | "history">("book");

  // Form State
  const [date, setDate] = useState("2026-08-28");
  const [timeSlot, setTimeSlot] = useState("14:30 - 15:30");
  const [serviceType, setServiceType] = useState("Tư vấn & Thử đồ tại showroom");
  const [guestCount, setGuestCount] = useState(2);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAppointments = () => {
    StorageService.init();
    const list = StorageService.getAppointments(user?.id || 2);
    setAppointments(list);
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error("Vui lòng chọn ngày hẹn!");
      return;
    }

    setIsSubmitting(true);
    try {
      StorageService.createAppointment({
        user_id: user?.id || 2,
        user_name: user?.name || "Nguyễn Văn Khách",
        user_phone: user?.phone || "0987654321",
        appointment_date: date,
        appointment_time: timeSlot,
        service_type: serviceType,
        guest_count: guestCount,
        note: note.trim(),
      });

      toast.success("Đặt lịch hẹn showroom thành công! Chuyên viên sẽ liên hệ xác nhận sớm nhất.");
      setNote("");
      fetchAppointments();
      setActiveTab("history");
    } catch (err: any) {
      toast.error(err.message || "Đặt lịch thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusMap: Record<
    AppointmentStatus,
    { label: string; color: string }
  > = {
    PENDING: { label: "Chờ Tiếp Đón", color: "bg-amber-50 text-amber-700 border-amber-200" },
    CONFIRMED: { label: "Đã Xác Nhận", color: "bg-blue-50 text-blue-700 border-blue-200" },
    COMPLETED: { label: "Đã Hoàn Thành", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    CANCELLED: { label: "Đã Hủy", color: "bg-rose-50 text-rose-700 border-rose-200" },
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-shopee-orange">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800">Đặt Lịch Hẹn Showroom</span>
        </div>

        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Trải Nghiệm Showroom 1-1 Miễn Phí
            </span>
            <h1 className="text-2xl md:text-3xl font-black">
              Đặt Lịch Thử Đồ & Trải Nghiệm Công Nghệ
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-lg leading-relaxed">
              Tránh chờ đợi, được chuyên viên chuẩn bị sẵn trang phục đúng size, trải nghiệm không gian âm thanh tai nghe ANC và thử trực tiếp các loại switch bàn phím cơ.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs space-y-2 flex-shrink-0">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <MapPin className="w-4 h-4" />
              <span>Showroom Flagship</span>
            </div>
            <p className="text-slate-300">Tầng 3, Trung Tâm Shopee Mini</p>
            <p className="text-slate-400">Quận 1, TP. Hồ Chí Minh</p>
          </div>
        </div>

        {/* Tabs Switcher */}
        <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("book")}
            className={`px-5 py-2.5 rounded-xl transition ${
              activeTab === "book"
                ? "bg-shopee-orange text-white shadow-md shadow-orange-200"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            📅 Đặt Lịch Hẹn Mới
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-5 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === "history"
                ? "bg-shopee-orange text-white shadow-md shadow-orange-200"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span>Lịch Hẹn Của Tôi</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px]">
              {appointments.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Booking Form */}
        {activeTab === "book" ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Thông Tin Đặt Lịch Hẹn
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Service Type */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Dịch vụ bạn muốn trải nghiệm (*)
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange font-semibold text-slate-800"
                >
                  <option value="Tư vấn & Thử đồ tại showroom">
                    👗 Tư vấn phối đồ & Thử trang phục thời trang
                  </option>
                  <option value="Trải nghiệm bàn phím cơ & gear công nghệ">
                    🎧 Trải nghiệm tai nghe ANC & Switch bàn phím cơ
                  </option>
                  <option value="Tư vấn bảo hành & Đổi mới sản phẩm">
                    🛡️ Hẹn tư vấn bảo hành & Đổi mới sản phẩm
                  </option>
                </select>
              </div>

              {/* Guest Count */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Số lượng người đi cùng (*)
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuestCount(num)}
                      className={`flex-1 py-2.5 rounded-xl font-bold border transition ${
                        guestCount === num
                          ? "border-shopee-orange bg-orange-50 text-shopee-orange"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {num} {num === 1 ? "người" : "người"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Picker */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Chọn ngày hẹn (*)
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange font-semibold text-slate-800"
                />
              </div>

              {/* Time Slot Picker */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Khung giờ đón tiếp (*)
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange font-semibold text-slate-800"
                >
                  <option value="09:00 - 10:30">09:00 - 10:30 (Buổi sáng)</option>
                  <option value="10:30 - 12:00">10:30 - 12:00 (Buổi trưa)</option>
                  <option value="14:00 - 15:30">14:00 - 15:30 (Buổi chiều)</option>
                  <option value="16:00 - 17:30">16:00 - 17:30 (Buổi chiều)</option>
                  <option value="18:30 - 20:00">18:30 - 20:00 (Buổi tối)</option>
                </select>
              </div>

              {/* Special Note */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Ghi chú yêu cầu đặc biệt (Tùy chọn)
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Cần chuẩn bị áo size L, muốn nghe thử tai nghe màu đen..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange resize-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                * Showroom mở cửa từ 08:30 đến 21:00 hàng ngày (kể cả Thứ 7, Chủ Nhật)
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-gradient-to-r from-shopee-orange to-amber-500 text-white font-bold text-xs rounded-2xl shadow-lg hover:shadow-orange-500/30 transition active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Đang Gửi Lịch Hẹn..." : "XÁC NHẬN ĐẶT HẸN"}
              </button>
            </div>
          </form>
        ) : (
          /* Tab 2: Appointment History */
          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((app) => {
                const status = statusMap[app.status] || statusMap.PENDING;
                return (
                  <div
                    key={app.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-shopee-orange" />
                        <span className="font-bold text-slate-800 text-sm">
                          Ngày hẹn: {formatDateOnly(app.appointment_date)} ({app.appointment_time})
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold border ${status.color}`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{status.label}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block">Dịch vụ đăng ký:</span>
                        <span className="font-bold text-slate-800">{app.service_type}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Khách hàng / SĐT:</span>
                        <span className="font-semibold text-slate-800">
                          {app.user_name} ({app.user_phone})
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Số lượng đi cùng:</span>
                        <span className="font-semibold text-slate-800">{app.guest_count} người</span>
                      </div>
                    </div>

                    {app.note && (
                      <p className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 italic border border-slate-100">
                        Ghi chú: &quot;{app.note}&quot;
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <EmptyState
                icon={Calendar}
                title="Chưa có lịch hẹn nào"
                description="Bạn chưa đặt lịch hẹn showroom nào. Hãy đăng ký trải nghiệm ngay hôm nay!"
                actionText="Đặt lịch hẹn ngay"
                onAction={() => setActiveTab("book")}
              />
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
