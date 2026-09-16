import { StorageService } from "./storage";

// `NEXT_PUBLIC_API_URL` is the documented deployment variable. Keep the old
// name as a fallback for existing environments.
const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL)?.trim();
const API_TIMEOUT_MS = 2500;

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackFn?: () => T
): Promise<T> {
  if (!BASE_URL && fallbackFn) {
    return fallbackFn();
  }

  const currentUser = typeof window !== "undefined" ? StorageService.getCurrentUser() : null;
  const token = typeof window !== "undefined" ? StorageService.getAuthToken() : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers || {}) as Record<string, string>),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (currentUser) {
    headers["X-User-Id"] = currentUser.id.toString();
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

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
