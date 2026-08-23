const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    "X-User-Id": "1", // Mock user fallback
    ...(options.headers || {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.message || "Có lỗi xảy ra khi gọi API");
  }

  return json.data;
}
