import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-12">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Siêu Sale Đón Đầu Xu Hướng 2026
            </span>
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              Mua Sắm Thả Ga Với Shopee Mini
            </h1>
            <p className="text-orange-100 text-sm md:text-base">
              Hàng ngàn sản phẩm thời trang, phụ kiện và công nghệ chính hãng đang chờ đón bạn.
            </p>
            <div className="pt-2">
              <Link href="/products" className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-6 py-3 rounded-xl shadow hover:bg-orange-50 transition">
                Khám Phá Ngay <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-shopee-orange rounded-xl"><Truck className="w-6 h-6" /></div>
            <div><h3 className="font-bold text-slate-800">Miễn Phí Vận Chuyển</h3><p className="text-xs text-slate-500">Đơn hàng từ 200.000đ</p></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-shopee-orange rounded-xl"><ShieldCheck className="w-6 h-6" /></div>
            <div><h3 className="font-bold text-slate-800">100% Chính Hãng</h3><p className="text-xs text-slate-500">Cam kết chất lượng cao</p></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-shopee-orange rounded-xl"><RefreshCw className="w-6 h-6" /></div>
            <div><h3 className="font-bold text-slate-800">Đổi Trả 7 Ngày</h3><p className="text-xs text-slate-500">Nhanh chóng & tiện lợi</p></div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
