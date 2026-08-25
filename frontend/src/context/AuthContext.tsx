"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserRole } from "@/types";
import { StorageService } from "@/lib/storage";
import { loginApi, registerApi, getMeApi } from "@/features/auth/auth.api";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  demoLogin: (role?: UserRole | "user" | "admin" | "USER" | "ADMIN") => Promise<void>;
  loginAsDemoUser: () => Promise<void>;
  loginAsDemoAdmin: () => Promise<void>;
  register: (name: string, email: string, password?: string, phone?: string, address?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    StorageService.init();
    async function loadCurrentUser() {
      try {
        const u = await getMeApi();
        setUser(u);
      } catch {
        const u = StorageService.getCurrentUser();
        setUser(u);
      } finally {
        setMounted(true);
      }
    }
    loadCurrentUser();
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const res = await loginApi(email, password);
      setUser(res.user);
      StorageService.setCurrentUser(res.user);
      toast.success(`Đăng nhập thành công! Chào mừng ${res.user.name}`);
      return true;
    } catch (err: any) {
      toast.error(err.message || "Đăng nhập thất bại");
      return false;
    }
  };

  const loginAsDemoUser = async () => {
    await login("user@minishop.vn", "123456");
  };

  const loginAsDemoAdmin = async () => {
    await login("admin@minishop.vn", "admin123");
  };

  const demoLogin = async (role: UserRole | "user" | "admin" | "USER" | "ADMIN" = "USER") => {
    const normalized = String(role).toUpperCase();
    if (normalized === "ADMIN") {
      await loginAsDemoAdmin();
    } else {
      await loginAsDemoUser();
    }
  };

  const register = async (
    name: string,
    email: string,
    password?: string,
    phone?: string,
    address?: string
  ): Promise<boolean> => {
    try {
      const res = await registerApi({ name, email, password, phone, address });
      setUser(res.user);
      StorageService.setCurrentUser(res.user);
      toast.success(`Đăng ký thành công! Chào mừng ${res.user.name}`);
      return true;
    } catch (err: any) {
      toast.error(err.message || "Đăng ký thất bại");
      return false;
    }
  };

  const logout = () => {
    StorageService.setCurrentUser(null);
    setUser(null);
    toast.info("Đã đăng xuất tài khoản");
  };

  return (
    <AuthContext.Provider
      value={{
        user: mounted ? user : null,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
        login,
        demoLogin,
        loginAsDemoUser,
        loginAsDemoAdmin,
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
