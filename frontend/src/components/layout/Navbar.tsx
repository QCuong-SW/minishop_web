"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  Calendar,
  User,
  Search,
  ShieldAlert,
  Package,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export function Navbar() {
  const router = useRouter();
  const { user, isAdmin, isAuthenticated, logout, demoLogin } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      {/* Top micro bar for announcements */}
      <div className="bg-gradient-to-r from-orange-600 via-shopee-orange to-amber-500 text-white text-[11px] font-medium py-1 px-4 text-center hidden md:flex items-center justify-between">
        <div className="flex items-center gap-1.5 mx-auto">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Chào mừng bạn đến với Shopee Mini — Miễn phí vận chuyển cho đơn hàng từ 200.000 đ!</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <Link href="/appointments" className="hover:underline">
            Đặt hẹn Showroom
          </Link>
          <span>|</span>
          <button
            onClick={() => demoLogin(isAdmin ? "USER" : "ADMIN")}
            className="hover:underline font-bold bg-white/20 px-2 py-0.5 rounded"
          >
            Chuyển quyền {isAdmin ? "Khách Hàng" : "Admin"} (Demo)
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-shopee-orange to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            🛒
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-shopee-orange tracking-tight leading-tight">
              Shopee<span className="text-slate-800">Mini</span>
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest -mt-0.5">
              E-Commerce 2026
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden sm:block relative">
          <div className="relative">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm kiếm áo thun, đầm nữ, phụ kiện, tai nghe..."
              className="w-full pl-10 pr-24 py-2 text-sm bg-slate-100/80 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-shopee-orange focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-shopee-orange text-white text-xs font-bold rounded-full hover:bg-shopee-hover transition"
            >
              Tìm kiếm
            </button>
          </div>
        </form>

        {/* Right Navigation Actions */}
        <nav className="flex items-center gap-3 md:gap-5 text-sm font-medium text-slate-700">
          {/* Explore Catalog */}
          <Link
            href="/products"
            className="hidden lg:flex items-center gap-1 hover:text-shopee-orange transition font-semibold"
          >
            Sản Phẩm
          </Link>

          {/* Showroom Appointment */}
          <Link
            href="/appointments"
            className="hidden md:flex items-center gap-1.5 hover:text-shopee-orange transition text-xs font-semibold py-1.5 px-3 rounded-full bg-slate-100 hover:bg-orange-50"
          >
            <Calendar className="w-3.5 h-3.5 text-shopee-orange" />
            <span>Hẹn Showroom</span>
          </Link>

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            className="relative p-2 rounded-xl text-slate-700 hover:text-rose-500 hover:bg-slate-100 transition"
            title="Sản phẩm yêu thích"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-scale">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2 rounded-xl text-slate-700 hover:text-shopee-orange hover:bg-slate-100 transition"
            title="Giỏ hàng"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-shopee-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-scale">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User Profile / Auth */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 border border-slate-200 transition"
              >
                <img
                  src={user.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-orange-200"
                />
                <span className="text-xs font-bold text-slate-800 hidden md:block max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <span
                      className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isAdmin ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {isAdmin ? "Quản Trị Viên (ADMIN)" : "Khách Hàng (USER)"}
                    </span>
                  </div>

                  <div className="py-1 text-xs font-medium space-y-0.5">
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-purple-700 hover:bg-purple-50 rounded-xl transition font-bold"
                      >
                        <ShieldAlert className="w-4 h-4" /> Trang Quản Trị (Admin)
                      </Link>
                    )}
                    <Link
                      href="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl transition"
                    >
                      <Package className="w-4 h-4" /> Đơn Hàng Của Tôi
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl transition"
                    >
                      <Heart className="w-4 h-4" /> Sản Phẩm Yêu Thích
                    </Link>
                    <Link
                      href="/appointments"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl transition"
                    >
                      <Calendar className="w-4 h-4" /> Lịch Hẹn Showroom
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    >
                      <LogOut className="w-4 h-4" /> Đăng Xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-shopee-orange text-white font-bold text-xs hover:bg-shopee-hover shadow-md hover:shadow transition active:scale-95"
            >
              <User className="w-4 h-4" /> Đăng nhập
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile Search & Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-orange"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 bg-slate-50 rounded-xl text-center hover:bg-orange-50 hover:text-shopee-orange"
            >
              Tất Cả Sản Phẩm
            </Link>
            <Link
              href="/appointments"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 bg-slate-50 rounded-xl text-center hover:bg-orange-50 hover:text-shopee-orange"
            >
              Hẹn Showroom
            </Link>
            <Link
              href="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 bg-slate-50 rounded-xl text-center hover:bg-orange-50 hover:text-shopee-orange"
            >
              Đơn Hàng Của Tôi
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 bg-slate-50 rounded-xl text-center hover:bg-orange-50 hover:text-shopee-orange"
            >
              Yêu Thích ({wishlistCount})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
