import {
  User,
  Category,
  Product,
  CartItem,
  Order,
  Coupon,
  Appointment,
  Review,
  DashboardStats,
  FilterParams,
  OrderStatus,
  AppointmentStatus,
} from "@/types";
import {
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_APPOINTMENTS,
  INITIAL_REVIEWS,
} from "./mock-data";
import { generateOrderCode, slugify } from "./utils";

const KEYS = {
  USERS: "shopee_mini_users",
  CATEGORIES: "shopee_mini_categories",
  PRODUCTS: "shopee_mini_products",
  CART: "shopee_mini_cart",
  WISHLIST: "shopee_mini_wishlist",
  ORDERS: "shopee_mini_orders",
  COUPONS: "shopee_mini_coupons",
  APPOINTMENTS: "shopee_mini_appointments",
  REVIEWS: "shopee_mini_reviews",
  AUTH: "shopee_mini_auth_user",
};

// Safe helper for localStorage
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving to localStorage key ${key}:`, err);
  }
}

export const StorageService = {
  init() {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(KEYS.USERS)) setItem(KEYS.USERS, INITIAL_USERS);
    if (!localStorage.getItem(KEYS.CATEGORIES)) setItem(KEYS.CATEGORIES, INITIAL_CATEGORIES);
    if (!localStorage.getItem(KEYS.PRODUCTS)) setItem(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    if (!localStorage.getItem(KEYS.COUPONS)) setItem(KEYS.COUPONS, INITIAL_COUPONS);
    if (!localStorage.getItem(KEYS.ORDERS)) setItem(KEYS.ORDERS, INITIAL_ORDERS);
    if (!localStorage.getItem(KEYS.APPOINTMENTS)) setItem(KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    if (!localStorage.getItem(KEYS.REVIEWS)) setItem(KEYS.REVIEWS, INITIAL_REVIEWS);
    if (!localStorage.getItem(KEYS.WISHLIST)) setItem(KEYS.WISHLIST, [108, 109]);
  },

  resetToSeed() {
    if (typeof window === "undefined") return;
    setItem(KEYS.USERS, INITIAL_USERS);
    setItem(KEYS.CATEGORIES, INITIAL_CATEGORIES);
    setItem(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setItem(KEYS.COUPONS, INITIAL_COUPONS);
    setItem(KEYS.ORDERS, INITIAL_ORDERS);
    setItem(KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    setItem(KEYS.REVIEWS, INITIAL_REVIEWS);
    setItem(KEYS.WISHLIST, [108, 109]);
    setItem(KEYS.CART, []);
  },

  // Auth User
  getCurrentUser(): User | null {
    return getItem<User | null>(KEYS.AUTH, INITIAL_USERS[1]); // Default to User (Nguyễn Văn Khách)
  },

  setCurrentUser(user: User | null): void {
    setItem(KEYS.AUTH, user);
  },

  // Users
  getUsers(): User[] {
    return getItem<User[]>(KEYS.USERS, INITIAL_USERS);
  },

  toggleUserStatus(userId: number): User[] {
    const users = this.getUsers().map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          status: (u.status === "ACTIVE" ? "BANNED" : "ACTIVE") as User["status"],
        };
      }
      return u;
    });
    setItem(KEYS.USERS, users);
    return users;
  },

  // Categories
  getCategories(): Category[] {
    const categories = getItem<Category[]>(KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const products = this.getProducts();
    return categories.map((cat) => ({
      ...cat,
      product_count: products.filter((p) => p.category_id === cat.id && p.status === "ACTIVE").length,
    }));
  },

  saveCategory(catData: Partial<Category>): Category {
    const categories = this.getCategories();
    if (catData.id) {
      const updated = categories.map((c) =>
        c.id === catData.id
          ? {
              ...c,
              ...catData,
              slug: catData.slug || slugify(catData.name || c.name),
            }
          : c
      );
      setItem(KEYS.CATEGORIES, updated);
      return updated.find((c) => c.id === catData.id)!;
    } else {
      const newId = categories.length ? Math.max(...categories.map((c) => c.id)) + 1 : 1;
      const newCat: Category = {
        id: newId,
        name: catData.name || "Danh mục mới",
        slug: catData.slug || slugify(catData.name || "danh-muc-moi"),
        description: catData.description || "",
        image_url: catData.image_url || "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
        status: "ACTIVE",
      };
      setItem(KEYS.CATEGORIES, [...categories, newCat]);
      return newCat;
    }
  },

  deleteCategory(id: number): boolean {
    const products = this.getProducts();
    const hasProducts = products.some((p) => p.category_id === id);
    if (hasProducts) {
      throw new Error("Không thể xóa danh mục đang có sản phẩm!");
    }
    const categories = this.getCategories().filter((c) => c.id !== id);
    setItem(KEYS.CATEGORIES, categories);
    return true;
  },

  // Products
  getProducts(params?: FilterParams): { items: Product[]; total: number } {
    let products = getItem<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const categories = this.getCategories();

    // Attach category names & reviews
    const reviews = this.getReviews();
    products = products.map((p) => {
      const cat = categories.find((c) => c.id === p.category_id);
      const prodReviews = reviews.filter((r) => r.product_id === p.id);
      const ratingAvg = prodReviews.length
        ? Number((prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length).toFixed(1))
        : p.rating_avg;
      return {
        ...p,
        category_name: cat ? cat.name : "Khác",
        reviews: prodReviews,
        rating_avg: ratingAvg,
        rating_count: prodReviews.length || p.rating_count,
      };
    });

    if (!params) return { items: products, total: products.length };

    // Filter by Category
    if (params.category_id) {
      products = products.filter((p) => p.category_id === Number(params.category_id));
    }

    // Filter by Keyword
    if (params.keyword && params.keyword.trim() !== "") {
      const kw = params.keyword.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(kw) ||
          (p.category_name && p.category_name.toLowerCase().includes(kw)) ||
          (p.description && p.description.toLowerCase().includes(kw))
      );
    }

    // Filter by Price
    if (params.min_price !== undefined) {
      products = products.filter((p) => p.price >= params.min_price!);
    }
    if (params.max_price !== undefined) {
      products = products.filter((p) => p.price <= params.max_price!);
    }

    // Filter by Rating
    if (params.rating) {
      products = products.filter((p) => p.rating_avg >= params.rating!);
    }

    // Sort
    if (params.sort) {
      switch (params.sort) {
        case "price_asc":
          products.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          products.sort((a, b) => b.price - a.price);
          break;
        case "sold_desc":
          products.sort((a, b) => (b.sold_count || 0) - (a.sold_count || 0));
          break;
        case "rating_desc":
          products.sort((a, b) => b.rating_avg - a.rating_avg);
          break;
        case "newest":
        default:
          products.sort((a, b) => (b.id || 0) - (a.id || 0));
          break;
      }
    }

    const total = products.length;

    // Pagination
    if (params.page && params.limit) {
      const start = (params.page - 1) * params.limit;
      products = products.slice(start, start + params.limit);
    }

    return { items: products, total };
  },

  getProductBySlug(slug: string): Product | null {
    const { items } = this.getProducts();
    return items.find((p) => p.slug === slug || p.id.toString() === slug) || null;
  },

  getProductById(id: number): Product | null {
    const { items } = this.getProducts();
    return items.find((p) => p.id === id) || null;
  },

  saveProduct(prodData: Partial<Product>): Product {
    const products = getItem<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const categories = this.getCategories();
    const cat = categories.find((c) => c.id === prodData.category_id);

    if (prodData.id) {
      const updated = products.map((p) =>
        p.id === prodData.id
          ? {
              ...p,
              ...prodData,
              slug: prodData.slug || (prodData.name ? slugify(prodData.name) : p.slug),
              category_name: cat ? cat.name : p.category_name,
            }
          : p
      );
      setItem(KEYS.PRODUCTS, updated);
      return this.getProductById(prodData.id)!;
    } else {
      const newId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 101;
      const newProd: Product = {
        id: newId,
        category_id: prodData.category_id || 1,
        category_name: cat ? cat.name : "Thời Trang Nam",
        name: prodData.name || "Sản phẩm mới",
        slug: prodData.slug || slugify(prodData.name || `san-pham-${newId}`),
        description: prodData.description || "",
        price: Number(prodData.price) || 100000,
        original_price: Number(prodData.original_price) || Number(prodData.price) || 120000,
        stock: Number(prodData.stock) || 50,
        sold_count: 0,
        image_url:
          prodData.image_url ||
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
        images: prodData.images || [
          prodData.image_url ||
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
        ],
        rating_avg: 5.0,
        rating_count: 0,
        status: prodData.status || "ACTIVE",
        created_at: new Date().toISOString(),
      };
      setItem(KEYS.PRODUCTS, [newProd, ...products]);
      return newProd;
    }
  },

  deleteProduct(id: number): boolean {
    const products = getItem<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS).filter((p) => p.id !== id);
    setItem(KEYS.PRODUCTS, products);
    return true;
  },

  // Cart
  getCart(): CartItem[] {
    return getItem<CartItem[]>(KEYS.CART, []);
  },

  addToCart(productId: number, quantity: number = 1): CartItem[] {
    const cart = this.getCart();
    const product = this.getProductById(productId);
    if (!product) throw new Error("Sản phẩm không tồn tại");

    const existingIndex = cart.findIndex((item) => item.product_id === productId);
    if (existingIndex > -1) {
      const newQty = cart[existingIndex].quantity + quantity;
      if (newQty > product.stock) {
        throw new Error(`Kho chỉ còn ${product.stock} sản phẩm`);
      }
      cart[existingIndex].quantity = newQty;
      cart[existingIndex].subtotal = newQty * cart[existingIndex].price;
    } else {
      if (quantity > product.stock) {
        throw new Error(`Kho chỉ còn ${product.stock} sản phẩm`);
      }
      cart.push({
        id: Date.now() + Math.random(),
        product_id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        original_price: product.original_price,
        image_url: product.image_url,
        quantity,
        subtotal: quantity * product.price,
        stock: product.stock,
        selected: true,
      });
    }

    setItem(KEYS.CART, cart);
    return cart;
  },

  updateCartItem(productId: number, quantity: number): CartItem[] {
    let cart = this.getCart();
    const product = this.getProductById(productId);
    if (!product) return cart;

    if (quantity <= 0) {
      cart = cart.filter((item) => item.product_id !== productId);
    } else {
      const target = cart.find((item) => item.product_id === productId);
      if (target) {
        const validQty = Math.min(quantity, product.stock);
        target.quantity = validQty;
        target.subtotal = validQty * target.price;
      }
    }

    setItem(KEYS.CART, cart);
    return cart;
  },

  toggleCartSelection(productId: number): CartItem[] {
    const cart = this.getCart();
    const target = cart.find((item) => item.product_id === productId);
    if (target) {
      target.selected = !target.selected;
      setItem(KEYS.CART, cart);
    }
    return cart;
  },

  toggleSelectAllCart(selected: boolean): CartItem[] {
    const cart = this.getCart().map((item) => ({ ...item, selected }));
    setItem(KEYS.CART, cart);
    return cart;
  },

  removeFromCart(productId: number): CartItem[] {
    const cart = this.getCart().filter((item) => item.product_id !== productId);
    setItem(KEYS.CART, cart);
    return cart;
  },

  clearCart(): void {
    setItem(KEYS.CART, []);
  },

  // Wishlist
  getWishlist(): number[] {
    return getItem<number[]>(KEYS.WISHLIST, [108, 109]);
  },

  toggleWishlist(productId: number): { isWishlisted: boolean; wishlist: number[] } {
    let wishlist = this.getWishlist();
    const exists = wishlist.includes(productId);
    if (exists) {
      wishlist = wishlist.filter((id) => id !== productId);
    } else {
      wishlist = [...wishlist, productId];
    }
    setItem(KEYS.WISHLIST, wishlist);
    return { isWishlisted: !exists, wishlist };
  },

  isWishlisted(productId: number): boolean {
    return this.getWishlist().includes(productId);
  },

  // Coupons
  getCoupons(): Coupon[] {
    return getItem<Coupon[]>(KEYS.COUPONS, INITIAL_COUPONS);
  },

  validateCoupon(code: string, orderAmount: number): { success: boolean; coupon?: Coupon; discount: number; message: string } {
    const coupons = this.getCoupons();
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.status === "ACTIVE");

    if (!coupon) {
      return { success: false, discount: 0, message: "Mã giảm giá không tồn tại hoặc đã hết hạn!" };
    }

    if (orderAmount < coupon.min_order_amount) {
      return {
        success: false,
        discount: 0,
        message: `Đơn hàng tối thiểu phải từ ${coupon.min_order_amount.toLocaleString("vi-VN")} đ để áp dụng mã này!`,
      };
    }

    if (coupon.used_count >= coupon.usage_limit) {
      return { success: false, discount: 0, message: "Mã giảm giá đã hết lượt sử dụng!" };
    }

    let discount = 0;
    if (coupon.discount_type === "FIXED") {
      discount = coupon.discount_value;
    } else {
      discount = (orderAmount * coupon.discount_value) / 100;
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    }

    return {
      success: true,
      coupon,
      discount,
      message: `Áp dụng mã ${coupon.code} thành công! Giảm ${discount.toLocaleString("vi-VN")} đ.`,
    };
  },

  saveCoupon(couponData: Partial<Coupon>): Coupon {
    const coupons = this.getCoupons();
    const newId = coupons.length ? Math.max(...coupons.map((c) => c.id)) + 1 : 1;
    const newCoupon: Coupon = {
      id: newId,
      code: (couponData.code || "DISCOUNT").toUpperCase().trim(),
      description: couponData.description || "",
      discount_type: couponData.discount_type || "FIXED",
      discount_value: Number(couponData.discount_value) || 20000,
      min_order_amount: Number(couponData.min_order_amount) || 100000,
      max_discount: couponData.max_discount ? Number(couponData.max_discount) : null,
      expires_at: couponData.expires_at || "2026-12-31 23:59:59",
      usage_limit: Number(couponData.usage_limit) || 100,
      used_count: 0,
      status: "ACTIVE",
    };
    setItem(KEYS.COUPONS, [newCoupon, ...coupons]);
    return newCoupon;
  },

  // Orders
  getOrders(userId?: number): Order[] {
    const orders = getItem<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
    if (userId) {
      return orders.filter((o) => o.user_id === userId);
    }
    return orders;
  },

  getOrderById(id: number | string): Order | null {
    const orders = this.getOrders();
    return (
      orders.find((o) => o.id.toString() === id.toString() || o.order_code === id.toString()) ||
      null
    );
  },

  createOrder(payload: {
    user_id: number;
    customer_name: string;
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    note?: string;
    payment_method: "COD" | "MOCK_BANKING";
    coupon_code?: string;
  }): Order {
    const cart = this.getCart().filter((item) => item.selected !== false);
    if (cart.length === 0) {
      throw new Error("Giỏ hàng của bạn đang trống!");
    }

    const products = getItem<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);

    // Verify stock
    for (const item of cart) {
      const prod = products.find((p) => p.id === item.product_id);
      if (!prod || prod.stock < item.quantity) {
        throw new Error(`Sản phẩm "${item.name}" không đủ số lượng trong kho!`);
      }
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 200000 ? 0 : 30000;

    let discountAmount = 0;
    let couponId: number | null = null;
    let validCouponCode: string | null = null;

    if (payload.coupon_code) {
      const couponCheck = this.validateCoupon(payload.coupon_code, subtotal);
      if (couponCheck.success && couponCheck.coupon) {
        discountAmount = couponCheck.discount;
        couponId = couponCheck.coupon.id;
        validCouponCode = couponCheck.coupon.code;

        // Increment coupon usage
        const coupons = this.getCoupons().map((c) =>
          c.id === couponId ? { ...c, used_count: c.used_count + 1 } : c
        );
        setItem(KEYS.COUPONS, coupons);
      }
    }

    const finalAmount = Math.max(0, subtotal + shippingFee - discountAmount);
    const orders = this.getOrders();
    const newOrderId = orders.length ? Math.max(...orders.map((o) => o.id)) + 1 : 5001;

    const orderItems = cart.map((item, index) => ({
      id: index + 1,
      order_id: newOrderId,
      product_id: item.product_id,
      product_name_snapshot: item.name,
      product_image_snapshot: item.image_url,
      unit_price: item.price,
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));

    const newOrder: Order = {
      id: newOrderId,
      order_code: generateOrderCode(),
      user_id: payload.user_id,
      customer_name: payload.customer_name,
      coupon_id: couponId,
      coupon_code: validCouponCode,
      total_amount: subtotal,
      shipping_fee: shippingFee,
      discount_amount: discountAmount,
      final_amount: finalAmount,
      status: payload.payment_method === "MOCK_BANKING" ? "CONFIRMED" : "PENDING",
      payment_method: payload.payment_method,
      payment_status: payload.payment_method === "MOCK_BANKING" ? "PAID" : "UNPAID",
      shipping_name: payload.shipping_name,
      shipping_phone: payload.shipping_phone,
      shipping_address: payload.shipping_address,
      note: payload.note || "",
      items: orderItems,
      created_at: new Date().toISOString(),
    };

    // Deduct stock and increment sold_count
    const updatedProducts = products.map((prod) => {
      const purchased = cart.find((item) => item.product_id === prod.id);
      if (purchased) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - purchased.quantity),
          sold_count: (prod.sold_count || 0) + purchased.quantity,
        };
      }
      return prod;
    });

    setItem(KEYS.PRODUCTS, updatedProducts);
    setItem(KEYS.ORDERS, [newOrder, ...orders]);
    this.clearCart();

    return newOrder;
  },

  updateOrderStatus(orderId: number, status: OrderStatus): Order[] {
    const orders = this.getOrders().map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          payment_status: status === "DELIVERED" ? "PAID" : o.payment_status,
        };
      }
      return o;
    });
    setItem(KEYS.ORDERS, orders);
    return orders;
  },

  cancelOrder(orderId: number): Order[] {
    const orders = this.getOrders();
    const target = orders.find((o) => o.id === orderId);
    if (!target) throw new Error("Không tìm thấy đơn hàng");
    if (target.status !== "PENDING") {
      throw new Error("Chỉ có thể hủy đơn hàng đang ở trạng thái Chờ duyệt (PENDING)!");
    }

    return this.updateOrderStatus(orderId, "CANCELLED");
  },

  // Appointments
  getAppointments(userId?: number): Appointment[] {
    const appointments = getItem<Appointment[]>(KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    if (userId) {
      return appointments.filter((a) => a.user_id === userId);
    }
    return appointments;
  },

  createAppointment(payload: {
    user_id: number;
    user_name: string;
    user_phone: string;
    appointment_date: string;
    appointment_time: string;
    service_type: string;
    guest_count: number;
    note?: string;
  }): Appointment {
    const appointments = this.getAppointments();
    const newId = appointments.length ? Math.max(...appointments.map((a) => a.id)) + 1 : 1;
    const newAppointment: Appointment = {
      id: newId,
      user_id: payload.user_id,
      user_name: payload.user_name,
      user_phone: payload.user_phone,
      appointment_date: payload.appointment_date,
      appointment_time: payload.appointment_time,
      service_type: payload.service_type,
      guest_count: Number(payload.guest_count) || 1,
      note: payload.note || "",
      status: "PENDING",
      created_at: new Date().toISOString(),
    };

    setItem(KEYS.APPOINTMENTS, [newAppointment, ...appointments]);
    return newAppointment;
  },

  updateAppointmentStatus(id: number, status: AppointmentStatus): Appointment[] {
    const appointments = this.getAppointments().map((a) => (a.id === id ? { ...a, status } : a));
    setItem(KEYS.APPOINTMENTS, appointments);
    return appointments;
  },

  // Reviews
  getReviews(productId?: number): Review[] {
    const reviews = getItem<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
    if (productId) {
      return reviews.filter((r) => r.product_id === productId);
    }
    return reviews;
  },

  addReview(payload: {
    user_id: number;
    user_name: string;
    user_avatar?: string;
    product_id: number;
    order_id?: number;
    rating: number;
    comment: string;
  }): Review {
    const reviews = this.getReviews();
    const newId = reviews.length ? Math.max(...reviews.map((r) => r.id)) + 1 : 1;
    const newReview: Review = {
      id: newId,
      user_id: payload.user_id,
      user_name: payload.user_name,
      user_avatar:
        payload.user_avatar ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
      product_id: payload.product_id,
      order_id: payload.order_id,
      rating: payload.rating,
      comment: payload.comment,
      created_at: new Date().toISOString(),
    };

    setItem(KEYS.REVIEWS, [newReview, ...reviews]);
    return newReview;
  },

  // Dashboard KPI
  getDashboardStats(): DashboardStats {
    const orders = this.getOrders();
    const products = this.getProducts().items;
    const users = this.getUsers();

    const deliveredOrders = orders.filter(
      (o) => o.status === "DELIVERED" || o.payment_status === "PAID"
    );
    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.final_amount, 0);

    const recentOrders = orders.slice(0, 5).map((o) => ({
      id: o.id,
      order_code: o.order_code,
      customer_name: o.shipping_name || o.customer_name || "Khách hàng",
      final_amount: o.final_amount,
      status: o.status,
      created_at: o.created_at,
    }));

    const salesChart = [
      { date: "18/08", revenue: 1450000, orders: 4 },
      { date: "19/08", revenue: 2100000, orders: 6 },
      { date: "20/08", revenue: 1850000, orders: 5 },
      { date: "21/08", revenue: 3200000, orders: 9 },
      { date: "22/08", revenue: 2900000, orders: 8 },
      { date: "23/08", revenue: 4100000, orders: 12 },
      { date: "Hôm nay", revenue: totalRevenue > 5000000 ? totalRevenue - 3000000 : 2600000, orders: 7 },
    ];

    return {
      overview: {
        total_revenue: totalRevenue || 15420000,
        total_orders: orders.length,
        total_products: products.length,
        total_users: users.length,
      },
      recent_orders: recentOrders,
      sales_chart: salesChart,
    };
  },
};
