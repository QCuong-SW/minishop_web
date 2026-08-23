import Link from "next/link";
import { Product } from "@/types";
import { formatVND } from "@/lib/utils";
import { Star, Heart } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition group">
      <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-slate-100 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm text-slate-600 hover:text-red-500">
          <Heart className="w-4 h-4" />
        </button>
      </Link>
      <div className="p-4">
        <span className="text-xs font-semibold text-shopee-orange">{product.category_name || "Sản phẩm"}</span>
        <Link href={`/products/${product.slug}`} className="block font-medium text-slate-800 line-clamp-2 mt-1 hover:text-shopee-orange">
          {product.name}
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold text-lg text-shopee-orange">{formatVND(product.price)}</span>
          <div className="flex items-center gap-1 text-xs text-amber-500 font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating_avg}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
