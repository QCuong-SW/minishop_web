"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserRole } from "@/types";
import { StorageService } from "@/lib/storage";
import { loginApi, registerApi, getMeApi } from "@/features/auth/auth.api";
import { AuthRequiredModal } from "@/components/auth/AuthRequiredModal";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCustomerUser: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  demoLogin: (role?: UserRole | "user" | "admin" | "USER" | "ADMIN") => Promise<void>;
  loginAsDemoUser: () => Promise<void>;
  loginAsDemoAdmin: () => Promise<void>;
  register: (name: string, email: string, password?: string, phone?: string, address?: string) => Promise<boolean>;
  logout: () => void;
  openAuthModal: (actionName?: string, redirectUrl?: string) => void;
  closeAuthModal: () => void;
  requireCustomerAuth: (actionName?: string, redirectUrl?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  // Auth Required Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalActionName, setModalActionName] = useState("sử dụng tính năng này");
  const [modalRedirectUrl, setModalRedirectUrl] = useState("/");

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

  const openAuthModal = (actionName: string = "sử dụng tính năng này", redirectUrl: string = "/") => {
    setModalActionName(actionName);
    setModalRedirectUrl(redirectUrl);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const requireCustomerAuth = (actionName: string = "sử dụng tính năng này", redirectUrl: string = "/"): boolean => {
    if (user && user.role === "USER") {
      return true;
    }
    openAuthModal(actionName, redirectUrl);
    return false;
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const res = await loginApi(email, password);
      setUser(res.user);
      StorageService.setCurrentUser(res.user);
      toast.success(`Đăng nhập thành công! Chào mừng ${res.user.name}`);
      setIsAuthModalOpen(false);
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
      setIsAuthModalOpen(false);
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

  const isCustomerUser = !!user && user.role === "USER";

  return (
    <AuthContext.Provider
      value={{
        user: mounted ? user : null,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
        isCustomerUser,
        login,
        demoLogin,
        loginAsDemoUser,
        loginAsDemoAdmin,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
        requireCustomerAuth,
      }}
    >
      {children}
      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        actionName={modalActionName}
        redirectUrl={modalRedirectUrl}
      />
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
