import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-slate-800">Chi Tiết Sản Phẩm: {params.slug}</h1>
      </main>
      <Footer />
    </div>
  );
}
