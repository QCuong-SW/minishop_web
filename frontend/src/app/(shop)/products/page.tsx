import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Tất Cả Sản Phẩm</h1>
        <p className="text-sm text-slate-500">Đang tải danh sách sản phẩm...</p>
      </main>
      <Footer />
    </div>
  );
}
