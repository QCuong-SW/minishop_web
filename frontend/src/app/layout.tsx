import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export const metadata: Metadata = {
  title: "MiniShop — Cửa Hàng Trực Tuyến & Trải Nghiệm Showroom",
  description:
    "Hệ thống E-Commerce MiniShop - Mua sắm thời trang, phụ kiện và công nghệ chính hãng. Đặt lịch trải nghiệm showroom trực tiếp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col pt-16 md:pt-0 pb-16 md:pb-0">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
              <MobileBottomNav />
              <Toaster
                position="top-right"
                richColors
                closeButton
                toastOptions={{
                  duration: 3500,
                  className: "text-sm font-medium",
                }}
              />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
