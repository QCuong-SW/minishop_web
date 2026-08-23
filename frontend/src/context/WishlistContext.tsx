"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { StorageService } from "@/lib/storage";
import { toast } from "sonner";
import { Product } from "@/types";

interface WishlistContextType {
  wishlistIds: number[];
  wishlistCount: number;
  wishlistProducts: Product[];
  toggleWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  refreshWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  const refreshWishlist = () => {
    const ids = StorageService.getWishlist();
    setWishlistIds(ids);
  };

  useEffect(() => {
    StorageService.init();
    refreshWishlist();
    setMounted(true);
  }, []);

  const toggleWishlist = (productId: number) => {
    const { isWishlisted, wishlist } = StorageService.toggleWishlist(productId);
    setWishlistIds([...wishlist]);
    const prod = StorageService.getProductById(productId);
    if (isWishlisted) {
      toast.success(`Đã thêm "${prod?.name || "sản phẩm"}" vào danh sách yêu thích ❤️`);
    } else {
      toast.info(`Đã bỏ yêu thích "${prod?.name || "sản phẩm"}"`);
    }
  };

  const isWishlisted = (productId: number) => {
    return wishlistIds.includes(productId);
  };

  const allProducts = mounted ? StorageService.getProducts().items : [];
  const wishlistProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds: mounted ? wishlistIds : [],
        wishlistCount: mounted ? wishlistIds.length : 0,
        wishlistProducts,
        toggleWishlist,
        isWishlisted,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
