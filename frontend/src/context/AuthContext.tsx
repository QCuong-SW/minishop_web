"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";
import { StorageService } from "@/lib/storage";
import { INITIAL_USERS } from "@/lib/mock-data";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (email: string, role?: "USER" | "ADMIN") => boolean;
  demoLogin: (role: "USER" | "ADMIN") => void;
  register: (name: string, email: string, phone?: string, address?: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    StorageService.init();
    const current = StorageService.getCurrentUser();
    setUser(current);
    setMounted(true);
  }, []);

  const login = (email: string, role: "USER" | "ADMIN" = "USER"): boolean => {
    const users = StorageService.getUsers();
    let found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      // If user not found, create a demo user session
      found = {
        id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 4,
        name: email.split("@")[0] || "Khách Hàng",
        email: email,
        role: role,
        avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
        phone: "0900000000",
        address: "TP. Hồ Chí Minh",
        status: "ACTIVE",
        created_at: new Date().toISOString(),
      };
    }

    if (found.status === "BANNED") {
      toast.error("Tài khoản của bạn đã bị khóa bởi Quản trị viên!");
      return false;
    }

    setUser(found);
    StorageService.setCurrentUser(found);
    toast.success(`Chào mừng trở lại, ${found.name}!`);
    return true;
  };

  const demoLogin = (role: "USER" | "ADMIN") => {
    if (role === "ADMIN") {
      const adminUser = INITIAL_USERS[0];
      setUser(adminUser);
      StorageService.setCurrentUser(adminUser);
      toast.success("Đã đăng nhập thành công với vai trò: Admin Quản Trị 🛡️");
      router.push("/admin");
    } else {
      const regularUser = INITIAL_USERS[1];
      setUser(regularUser);
      StorageService.setCurrentUser(regularUser);
      toast.success("Đã đăng nhập thành công với tài khoản: Khách hàng mẫu 🛒");
      router.push("/");
    }
  };

  const register = (
    name: string,
    email: string,
    phone: string = "0987654321",
    address: string = "TP. Hồ Chí Minh"
  ): boolean => {
    const users = StorageService.getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error("Email này đã được đăng ký!");
      return false;
    }

    const newUser: User = {
      id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      name,
      email,
      role: "USER",
      avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
      phone,
      address,
      status: "ACTIVE",
      created_at: new Date().toISOString(),
    };

    setUser(newUser);
    StorageService.setCurrentUser(newUser);
    toast.success("Đăng ký tài khoản thành công!");
    return true;
  };

  const logout = () => {
    setUser(null);
    StorageService.setCurrentUser(null);
    toast.info("Đã đăng xuất tài khoản!");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user: mounted ? user : null,
        isAdmin: user?.role === "ADMIN",
        isAuthenticated: !!user,
        login,
        demoLogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
