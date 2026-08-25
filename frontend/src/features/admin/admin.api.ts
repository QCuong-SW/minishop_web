import { apiFetch } from "@/lib/api-client";
import { StorageService } from "@/lib/storage";
import {
  DashboardStats,
  Product,
  Category,
  Order,
  OrderStatus,
  Coupon,
  Appointment,
  AppointmentStatus,
  User,
  UserStatus,
} from "@/types";

export const getDashboardStatsApi = async (): Promise<DashboardStats> => {
  return apiFetch<DashboardStats>(
    "/admin/dashboard",
    {},
    () => StorageService.getDashboardStats()
  );
};

export const getAdminProductsApi = async (): Promise<{ items: Product[]; meta?: any }> => {
  return apiFetch<{ items: Product[]; meta?: any }>(
    "/products?limit=100",
    {},
    () => StorageService.getProducts({ limit: 100 })
  );
};

export const createProductApi = async (data: Partial<Product>): Promise<Product> => {
  return apiFetch<Product>(
    "/products",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    () => StorageService.saveProduct(data)
  );
};

export const updateProductApi = async (id: number, data: Partial<Product>): Promise<Product> => {
  return apiFetch<Product>(
    `/products/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    () => StorageService.saveProduct({ ...data, id })
  );
};

export const deleteProductApi = async (id: number): Promise<void> => {
  return apiFetch<void>(
    `/products/${id}`,
    {
      method: "DELETE",
    },
    () => {
      StorageService.deleteProduct(id);
    }
  );
};

export const getAdminCategoriesApi = async (): Promise<Category[]> => {
  return apiFetch<Category[]>(
    "/categories",
    {},
    () => StorageService.getCategories()
  );
};

export const createCategoryApi = async (data: Partial<Category>): Promise<Category> => {
  return apiFetch<Category>(
    "/categories",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    () => StorageService.saveCategory(data)
  );
};

export const updateCategoryApi = async (id: number, data: Partial<Category>): Promise<Category> => {
  return apiFetch<Category>(
    `/categories/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    () => StorageService.saveCategory({ ...data, id })
  );
};

export const deleteCategoryApi = async (id: number): Promise<void> => {
  return apiFetch<void>(
    `/categories/${id}`,
    {
      method: "DELETE",
    },
    () => {
      StorageService.deleteCategory(id);
    }
  );
};

export const getAdminOrdersApi = async (): Promise<Order[]> => {
  return apiFetch<Order[]>(
    "/orders",
    {},
    () => StorageService.getOrders()
  );
};

export const updateOrderStatusApi = async (id: number, status: OrderStatus): Promise<any> => {
  return apiFetch<any>(
    `/orders/${id}/status`,
    {
      method: "PUT",
      body: JSON.stringify({ status }),
    },
    () => {
      StorageService.updateOrderStatus(id, status);
      return { success: true };
    }
  );
};

export const getAdminCouponsApi = async (): Promise<Coupon[]> => {
  return apiFetch<Coupon[]>(
    "/coupons",
    {},
    () => StorageService.getCoupons()
  );
};

export const createCouponApi = async (data: Partial<Coupon>): Promise<Coupon> => {
  return apiFetch<Coupon>(
    "/coupons",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    () => StorageService.saveCoupon(data)
  );
};

export const getAdminAppointmentsApi = async (): Promise<Appointment[]> => {
  return apiFetch<Appointment[]>(
    "/appointments",
    {},
    () => StorageService.getAppointments()
  );
};

export const updateAppointmentStatusApi = async (
  id: number,
  status: AppointmentStatus
): Promise<any> => {
  return apiFetch<any>(
    `/appointments/${id}/status`,
    {
      method: "PUT",
      body: JSON.stringify({ status }),
    },
    () => {
      StorageService.updateAppointmentStatus(id, status);
      return { success: true };
    }
  );
};

export const getAdminUsersApi = async (): Promise<User[]> => {
  return apiFetch<User[]>(
    "/users",
    {},
    () => StorageService.getUsers()
  );
};

export const updateUserStatusApi = async (id: number, status: UserStatus): Promise<any> => {
  return apiFetch<any>(
    `/users/${id}/status`,
    {
      method: "PUT",
      body: JSON.stringify({ status }),
    },
    () => {
      StorageService.toggleUserStatus(id);
      return { success: true };
    }
  );
};
