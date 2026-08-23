"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem } from "@/types";
import { StorageService } from "@/lib/storage";
import { toast } from "sonner";

interface CartContextType {
  cart: CartItem[];
  itemCount: number;
  selectedCount: number;
  totalAmount: number;
  addToCart: (productId: number, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  toggleSelection: (productId: number) => void;
  toggleSelectAll: (selected: boolean) => void;
  clearCart: () => void;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const refreshCart = () => {
    const currentCart = StorageService.getCart();
    setCart(currentCart);
  };

  useEffect(() => {
    StorageService.init();
    refreshCart();
    setMounted(true);
  }, []);

  const addToCart = (productId: number, quantity: number = 1) => {
    try {
      const updated = StorageService.addToCart(productId, quantity);
      setCart([...updated]);
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

  const updateQuantity = (productId: number, quantity: number) => {
    try {
      const updated = StorageService.updateCartItem(productId, quantity);
      setCart([...updated]);
    } catch (err: any) {
      toast.error(err.message || "Lỗi cập nhật số lượng");
    }
  };

  const removeFromCart = (productId: number) => {
    const updated = StorageService.removeFromCart(productId);
    setCart([...updated]);
    toast.info("Đã xóa sản phẩm khỏi giỏ hàng");
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
