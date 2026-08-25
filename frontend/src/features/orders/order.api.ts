import { apiFetch } from "@/lib/api-client";
import { StorageService } from "@/lib/storage";
import { Order } from "@/types";

export const getOrdersApi = async (): Promise<Order[]> => {
  return apiFetch<Order[]>(
    "/orders",
    {},
    () => {
      const currentUser = StorageService.getCurrentUser();
      return StorageService.getOrders(currentUser?.id || 2);
    }
  );
};

export const getOrderByIdApi = async (id: string | number): Promise<Order | null> => {
  return apiFetch<Order | null>(
    `/orders/${id}`,
    {},
    () => StorageService.getOrderById(id)
  );
};

export const cancelOrderApi = async (id: number): Promise<any> => {
  return apiFetch<any>(
    `/orders/${id}/cancel`,
    {
      method: "PUT",
    },
    () => {
      StorageService.cancelOrder(id);
      return { success: true };
    }
  );
};
