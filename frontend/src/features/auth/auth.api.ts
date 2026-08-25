import { apiFetch } from "@/lib/api-client";
import { StorageService } from "@/lib/storage";
import { User } from "@/types";

export interface LoginResponse {
  user: User;
  token?: string;
}

export const loginApi = async (email: string, password?: string): Promise<LoginResponse> => {
  return apiFetch<LoginResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password: password || "123456" }),
    },
    () => {
      const users = StorageService.getUsers();
      let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
      if (!user) {
        if (email.toLowerCase().includes("admin")) {
          user = users.find((u) => u.role === "ADMIN") || users[0];
        } else {
          user = users.find((u) => u.role === "USER") || users[1];
        }
      }
      if (!user) throw new Error("Email hoặc mật khẩu không chính xác");
      StorageService.setCurrentUser(user);
      return {
        user,
        token: `mock-jwt-token-${user.id}`,
      };
    }
  );
};

export const registerApi = async (data: {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
}): Promise<LoginResponse> => {
  return apiFetch<LoginResponse>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password || "123456",
        phone: data.phone,
        address: data.address,
      }),
    },
    () => {
      const users = StorageService.getUsers();
      const newId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 10;
      const newUser: User = {
        id: newId,
        name: data.name,
        email: data.email,
        role: "USER",
        phone: data.phone,
        address: data.address,
        status: "ACTIVE",
        created_at: new Date().toISOString(),
      };
      StorageService.setCurrentUser(newUser);
      return {
        user: newUser,
        token: `mock-jwt-token-${newUser.id}`,
      };
    }
  );
};

export const getMeApi = async (): Promise<User | null> => {
  return apiFetch<User | null>(
    "/auth/me",
    {},
    () => StorageService.getCurrentUser()
  );
};
