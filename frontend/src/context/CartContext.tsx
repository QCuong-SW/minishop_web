"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem } from "@/types";
import { StorageService } from "@/lib/storage";
import { addToCartApi, getCartApi, removeCartItemApi, updateCartItemApi } from "@/features/cart/cart.api";
import { toast } from "sonner";

interface CartContextType {
  cart: CartItem[];
  itemCount: number;
  selectedCount: number;
  totalAmount: number;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  toggleSelection: (productId: number) => void;
  toggleSelectAll: (selected: boolean) => void;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const refreshCart = async () => {
    try {
      const res = await getCartApi();
      setCart(res.items || []);
    } catch {
      const currentCart = StorageService.getCart();
      setCart(currentCart);
    }
  };

  useEffect(() => {
    StorageService.init();
    refreshCart();
    setMounted(true);
  }, []);

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      const res = await addToCartApi(productId, quantity);
      setCart([...res.items]);
      const product = StorageService.getProductById(productId);
      toast.success(
        `Đã thêm ${quantity} x "${product?.name || "sản phẩm"}" vào giỏ hàng!`,
        {
          action: {
            label: "Xem giỏ",
            onClick: () => {
              window.location.href = "/cart";
            },
          },
        }
      );
    } catch (err: any) {
      toast.error(err.message || "Không thể thêm vào giỏ hàng");
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      await updateCartItemApi(productId, quantity);
      const updated = StorageService.updateCartItem(productId, quantity);
      setCart([...updated]);
    } catch (err: any) {
      toast.error(err.message || "Lỗi cập nhật số lượng");
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      await removeCartItemApi(productId);
      const updated = StorageService.removeFromCart(productId);
      setCart([...updated]);
      toast.info("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi xóa sản phẩm");
    }
  };

  const toggleSelection = (productId: number) => {
    const updated = StorageService.toggleCartSelection(productId);
    setCart([...updated]);
  };

  const toggleSelectAll = (selected: boolean) => {
    const updated = StorageService.toggleSelectAllCart(selected);
    setCart([...updated]);
  };

  const clearCart = () => {
    StorageService.clearCart();
    setCart([]);
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const selectedItems = cart.filter((item) => item.selected !== false);
  const selectedCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <CartContext.Provider
      value={{
        cart: mounted ? cart : [],
        itemCount: mounted ? itemCount : 0,
        selectedCount: mounted ? selectedCount : 0,
        totalAmount: mounted ? totalAmount : 0,
        addToCart,
        updateQuantity,
        removeFromCart,
        toggleSelection,
        toggleSelectAll,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
