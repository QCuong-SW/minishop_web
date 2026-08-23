import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  MapPin,
  Phone,
  Mail,
  Heart,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Value Propositions Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-slate-800 text-shopee-orange rounded-2xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Giao Hàng Siêu Tốc</h4>
              <p className="text-xs text-slate-400">Freeship từ đơn 200k</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-slate-800 text-shopee-orange rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Chính Hãng</h4>
              <p className="text-xs text-slate-400">Cam kết chất lượng cao</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-slate-800 text-shopee-orange rounded-2xl">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Đổi Trả 7 Ngày</h4>
              <p className="text-xs text-slate-400">Thủ tục nhanh gọn</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-slate-800 text-shopee-orange rounded-2xl">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Tư Vấn 24/7</h4>
              <p className="text-xs text-slate-400">Hỗ trợ nhiệt tình</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs leading-relaxed">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black text-shopee-orange tracking-tight">
                🛒 Shopee<span className="text-white">Mini</span>
              </span>
            </Link>
            <p className="text-slate-400">
              Nền tảng thương mại điện tử trải nghiệm đa kênh — Mua sắm trực tuyến & Đặt lịch trải nghiệm sản phẩm trực tiếp tại Showroom.
            </p>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-shopee-orange flex-shrink-0" />
                <span>Trụ sở chính Shopee Mini, Quận 1, TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-shopee-orange flex-shrink-0" />
                <span>Hotline: 1900 6868 (Miễn phí)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-shopee-orange flex-shrink-0" />
                <span>support@shopeemini.vn</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Về Shopee Mini</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/products" className="hover:text-shopee-orange transition">Tất cả sản phẩm</Link></li>
              <li><Link href="/appointments" className="hover:text-shopee-orange transition">Đặt hẹn Showroom</Link></li>
              <li><Link href="/orders" className="hover:text-shopee-orange transition">Tra cứu đơn hàng</Link></li>
              <li><Link href="/wishlist" className="hover:text-shopee-orange transition">Danh sách yêu thích</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Chính Sách & Hỗ Trợ</h4>
            <ul className="space-y-2 text-slate-400">
              <li><span className="hover:text-shopee-orange transition cursor-pointer">Chính sách bảo hành & đổi trả</span></li>
              <li><span className="hover:text-shopee-orange transition cursor-pointer">Chính sách vận chuyển</span></li>
              <li><span className="hover:text-shopee-orange transition cursor-pointer">Hướng dẫn mua hàng trả góp</span></li>
              <li><span className="hover:text-shopee-orange transition cursor-pointer">Bảo mật thông tin khách hàng</span></li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Thanh Toán & An Toàn</h4>
            <p className="text-slate-400">Hỗ trợ thanh toán khi nhận hàng (COD) và Chuyển khoản mô phỏng (Mock Banking).</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-[10px] font-bold text-slate-300 border border-slate-700">
                💵 COD Tiền Mặt
              </span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-[10px] font-bold text-slate-300 border border-slate-700">
                🏦 Mock Banking
              </span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-[10px] font-bold text-slate-300 border border-slate-700">
                🔒 SSL Secure
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Shopee Mini. Đồ án môn học Lập trình Web — Next.js & PHP OOP Architecture.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Thiết kế & hoàn thiện với</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>bởi Nhóm Phát Triển</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
