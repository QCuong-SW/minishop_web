export type UserRole = "USER" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  address?: string;
  status: UserStatus;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  product_count?: number;
  status?: "ACTIVE" | "INACTIVE";
}

export interface Review {
  id: number;
  user_id: number;
  user_name: string;
  user_avatar?: string;
  product_id: number;
  order_id?: number;
  rating: number;
  comment: string;
  created_at: string;
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
  images?: string[];
  rating_avg: number;
  rating_count: number;
  sold_count?: number;
  status: "ACTIVE" | "INACTIVE";
  created_at?: string;
  reviews?: Review[];
}

export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  slug: string;
  price: number;
  original_price?: number;
  image_url: string;
  quantity: number;
  subtotal: number;
  stock: number;
  selected?: boolean;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod = "COD" | "MOCK_BANKING";
export type PaymentStatus = "UNPAID" | "PAID";

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name_snapshot: string;
  product_image_snapshot: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_code: string;
  user_id: number;
  customer_name?: string;
  coupon_id?: number | null;
  coupon_code?: string | null;
  total_amount: number;
  shipping_fee: number;
  discount_amount: number;
  final_amount: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  note?: string;
  items: OrderItem[];
  created_at: string;
}

export type DiscountType = "FIXED" | "PERCENT";

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount: number;
  max_discount?: number | null;
  expires_at: string;
  usage_limit: number;
  used_count: number;
  status: "ACTIVE" | "INACTIVE";
}

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type ServiceType = "TRY_CLOTHES" | "TECH_EXPERIENCE" | "WARRANTY_CONSULT" | "OTHER" | string;

export interface Appointment {
  id: number;
  user_id: number;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  user_name?: string;
  user_phone?: string;
  appointment_date: string;
  appointment_time: string;
  service_type: ServiceType;
  guest_count?: number;
  note?: string;
  status: AppointmentStatus;
  created_at: string;
}

export interface DashboardStats {
  overview: {
    total_revenue: number;
    total_orders: number;
    total_products: number;
    total_categories?: number;
    total_users: number;
  };
  recent_orders: {
    id: number;
    order_code: string;
    customer_name: string;
    final_amount: number;
    status: OrderStatus;
    created_at: string;
  }[];
  sales_chart: {
    date: string;
    revenue: number;
    orders: number;
  }[];
}

export interface FilterParams {
  category_id?: number;
  keyword?: string;
  min_price?: number;
  max_price?: number;
  rating?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "sold_desc" | "rating_desc";
  page?: number;
  limit?: number;
}
