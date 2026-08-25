"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { StorageService } from "@/lib/storage";
import { getWishlistApi, toggleWishlistApi } from "@/features/wishlist/wishlist.api";
import { toast } from "sonner";
import { Product } from "@/types";

interface WishlistContextType {
  wishlistIds: number[];
  wishlistCount: number;
  wishlistProducts: Product[];
  toggleWishlist: (productId: number) => Promise<void>;
  isWishlisted: (productId: number) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  const refreshWishlist = async () => {
    try {
      const ids = await getWishlistApi();
      setWishlistIds(ids || []);
    } catch {
      const ids = StorageService.getWishlist();
      setWishlistIds(ids);
    }
  };

  useEffect(() => {
    StorageService.init();
    refreshWishlist();
    setMounted(true);
  }, []);

  const toggleWishlist = async (productId: number) => {
    try {
      const res = await toggleWishlistApi(productId);
      if (res.is_wishlisted) {
        setWishlistIds((prev) => Array.from(new Set([...prev, productId])));
        toast.success("Đã thêm vào danh sách yêu thích ❤️");
      } else {
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
        toast.info("Đã bỏ yêu thích sản phẩm");
      }
    } catch {
      const { isWishlisted, wishlist } = StorageService.toggleWishlist(productId);
      setWishlistIds([...wishlist]);
      if (isWishlisted) {
        toast.success("Đã thêm vào danh sách yêu thích ❤️");
      } else {
        toast.info("Đã bỏ yêu thích sản phẩm");
      }
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
