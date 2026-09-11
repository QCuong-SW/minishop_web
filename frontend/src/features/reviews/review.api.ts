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
      if (!currentUser || currentUser.role !== "USER") {
        throw new Error("Vui lòng đăng nhập tài khoản khách hàng để đánh giá");
      }
      return StorageService.addReview({
        product_id: payload.product_id,
        user_id: currentUser.id,
        user_name: currentUser.name,
        user_avatar: currentUser.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
        rating: payload.rating,
        comment: payload.comment,
      });
    }
  );
};
