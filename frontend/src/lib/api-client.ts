import { StorageService } from "./storage";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://minishop-ea3l.onrender.com/api";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackFn?: () => T
): Promise<T> {
  const currentUser = typeof window !== "undefined" ? StorageService.getCurrentUser() : null;
  const headers = {
    "Content-Type": "application/json",
    "X-User-Id": currentUser ? currentUser.id.toString() : "1",
    ...(options.headers || {}),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout for Cloud / Local API

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const json = await response.json();
    if (!json.success && !json.data) {
      throw new Error(json.message || "Có lỗi xảy ra khi gọi API");
    }

    return json.data !== undefined ? json.data : (json as unknown as T);
  } catch (error) {
    // If backend is not running or network fails, gracefully execute fallback mock store
    if (fallbackFn) {
      return fallbackFn();
    }
    throw error;
  }
}
