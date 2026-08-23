import { apiFetch } from "@/lib/api-client";
import { Product } from "@/types";

export const getProducts = (params?: Record<string, string>) => {
  const searchParams = new URLSearchParams(params).toString();
  return apiFetch<Product[]>(`/products?${searchParams}`);
};

export const getProductBySlug = (slug: string) => {
  return apiFetch<Product>(`/products/${slug}`);
};
