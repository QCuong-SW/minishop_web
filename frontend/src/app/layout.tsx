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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { rel: "icon", url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col pb-16 md:pb-0">
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
