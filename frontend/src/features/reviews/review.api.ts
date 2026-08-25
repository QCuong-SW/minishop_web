import { apiFetch } from "@/lib/api-client";
import { StorageService } from "@/lib/storage";
import { Review } from "@/types";

export const createReviewApi = async (payload: {
  product_id: number;
  order_id?: number;
  rating: number;
  comment: string;
}): Promise<Review> => {
  return apiFetch<Review>(
    "/reviews",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    () => {
      const currentUser = StorageService.getCurrentUser();
      return StorageService.addReview({
        product_id: payload.product_id,
        user_id: currentUser?.id || 2,
        user_name: currentUser?.name || "Nguyễn Văn Khách",
        user_avatar: currentUser?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
        rating: payload.rating,
        comment: payload.comment,
      });
    }
  );
};
