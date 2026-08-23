import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function CheckoutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">💳 Thanh Toán & Đặt Hàng</h1>
      </main>
      <Footer />
    </div>
  );
}
