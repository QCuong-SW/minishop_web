import Link from "next/link";
import { ShoppingCart, Heart, Calendar, User } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="text-2xl font-black text-shopee-orange tracking-tight">
          🛒 Shopee<span className="text-slate-800">Mini</span>
        </Link>
        <div className="flex-1 max-w-xl">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm, danh mục..."
            className="w-full px-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shopee-orange"
          />
        </div>
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-700">
          <Link href="/appointments" className="flex items-center gap-1 hover:text-shopee-orange">
            <Calendar className="w-4 h-4" /> Lịch Showroom
          </Link>
          <Link href="/wishlist" className="flex items-center gap-1 hover:text-shopee-orange">
            <Heart className="w-4 h-4" /> Yêu thích
          </Link>
          <Link href="/cart" className="flex items-center gap-1 hover:text-shopee-orange relative">
            <ShoppingCart className="w-5 h-5" /> Giỏ hàng
          </Link>
          <Link href="/login" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-shopee-orange text-white hover:bg-shopee-hover">
            <User className="w-4 h-4" /> Đăng nhập
          </Link>
        </nav>
      </div>
    </header>
  );
}
