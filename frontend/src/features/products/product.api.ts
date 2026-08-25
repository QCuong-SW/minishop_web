import { apiFetch } from "@/lib/api-client";
import { StorageService } from "@/lib/storage";
import { Product, Category, Review, FilterParams } from "@/types";

export const getCategories = async (): Promise<Category[]> => {
  return apiFetch<Category[]>(
    "/categories",
    {},
    () => StorageService.getCategories()
  );
};

export const getProducts = async (params?: FilterParams): Promise<{ items: Product[]; meta?: any }> => {
  const query = new URLSearchParams();
  if (params?.category_id) query.append("category_id", params.category_id.toString());
  if (params?.keyword) query.append("keyword", params.keyword);
  if (params?.min_price !== undefined) query.append("min_price", params.min_price.toString());
  if (params?.max_price !== undefined) query.append("max_price", params.max_price.toString());
  if (params?.rating !== undefined) query.append("rating", params.rating.toString());
  if (params?.sort) query.append("sort", params.sort);
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());

  const qs = query.toString();
  return apiFetch<{ items: Product[]; meta?: any }>(
    `/products${qs ? `?${qs}` : ""}`,
    {},
    () => StorageService.getProducts(params)
  );
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  return apiFetch<Product | null>(
    `/products/${slug}`,
    {},
    () => StorageService.getProductBySlug(slug)
  );
};

export const getProductReviews = async (productId: number): Promise<Review[]> => {
  return apiFetch<Review[]>(
    `/products/${productId}/reviews`,
    {},
    () => StorageService.getReviews(productId)
  );
};
