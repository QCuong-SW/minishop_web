export interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  avatar_url?: string;
  phone?: string;
  address?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

export interface Product {
  id: number;
  category_id: number;
  category_name?: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  original_price?: number;
  stock: number;
  image_url: string;
  rating_avg: number;
  rating_count: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  subtotal: number;
  stock: number;
}

export interface Order {
  id: number;
  order_code: string;
  user_id: number;
  total_amount: number;
  shipping_fee: number;
  discount_amount: number;
  final_amount: number;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPING" | "DELIVERED" | "CANCELLED";
  payment_method: "COD" | "MOCK_BANKING";
  payment_status: "UNPAID" | "PAID";
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  created_at: string;
}
