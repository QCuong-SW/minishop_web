import { apiFetch } from "@/lib/api-client";
import { StorageService } from "@/lib/storage";
import { CartItem } from "@/types";

export const getCartApi = async (): Promise<{ items: CartItem[]; total_quantity: number; total_amount: number }> => {
  return apiFetch<{ items: CartItem[]; total_quantity: number; total_amount: number }>(
    "/cart",
    {},
    () => {
      const items = StorageService.getCart();
      const total_quantity = items.reduce((sum, i) => sum + i.quantity, 0);
      const total_amount = items.reduce((sum, i) => sum + i.subtotal, 0);
      return { items, total_quantity, total_amount };
    }
  );
};

export const addToCartApi = async (productId: number, quantity = 1): Promise<{ items: CartItem[]; total_quantity: number; total_amount: number }> => {
  return apiFetch(
    "/cart/items",
    {
      method: "POST",
      body: JSON.stringify({ product_id: productId, quantity }),
    },
    () => {
      const items = StorageService.addToCart(productId, quantity);
      const total_quantity = items.reduce((sum, i) => sum + i.quantity, 0);
      const total_amount = items.reduce((sum, i) => sum + i.subtotal, 0);
      return { items, total_quantity, total_amount };
    }
  );
};

export const updateCartItemApi = async (productIdOrId: number, quantity: number): Promise<void> => {
  return apiFetch(
    `/cart/items/${productIdOrId}`,
    {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    },
    () => {
      StorageService.updateCartItem(productIdOrId, quantity);
    }
  );
};

export const removeCartItemApi = async (productIdOrId: number): Promise<void> => {
  return apiFetch(
    `/cart/items/${productIdOrId}`,
    {
      method: "DELETE",
    },
    () => {
      StorageService.removeFromCart(productIdOrId);
    }
  );
};
