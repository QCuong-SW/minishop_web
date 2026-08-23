import { apiFetch } from "@/lib/api-client";
import { CartItem } from "@/types";

export const getCart = () => apiFetch<{ items: CartItem[]; total_quantity: number; total_amount: number }>("/cart");
export const addToCart = (productId: number, quantity = 1) => apiFetch("/cart/items", {
  method: "POST",
  body: JSON.stringify({ product_id: productId, quantity }),
});
