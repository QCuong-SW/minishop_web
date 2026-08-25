import { apiFetch } from "@/lib/api-client";
import { StorageService } from "@/lib/storage";

export const getWishlistApi = async (): Promise<number[]> => {
  return apiFetch<number[]>(
    "/wishlist",
    {},
    () => StorageService.getWishlist()
  );
};

export const toggleWishlistApi = async (productId: number): Promise<{ is_wishlisted: boolean }> => {
  return apiFetch<{ is_wishlisted: boolean }>(
    `/wishlist/${productId}`,
    {
      method: "POST",
    },
    () => {
      const res = StorageService.toggleWishlist(productId);
      return { is_wishlisted: res.isWishlisted };
    }
  );
};
