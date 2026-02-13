// lib/api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE) {
  console.warn("NEXT_PUBLIC_API_URL is not set");
}

export interface ApiFetchOptions extends RequestInit {
  /** Путь без базового URL, например: "/api/items" */
  path: string;
}

/**
 * Унифицированный helper для запросов к бэкенду.
 * Примеры:
 *   apiFetch({ path: "/api/items/admin" })
 *   apiFetch({ path: "/api/items", method: "POST", body: formData })
 */
export async function apiFetch<T = any>({
  path,
  ...options
}: ApiFetchOptions): Promise<T> {
  if (!API_BASE) {
    throw new Error("API base URL is not configured (NEXT_PUBLIC_API_URL)");
  }

  const url =
    path.startsWith("http") || path.startsWith("https")
      ? path
      : `${API_BASE}${path}`;

  const res = await fetch(url, {
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Request failed: ${res.status} ${res.statusText} ${text || ""}`.trim(),
    );
  }

  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    // @ts-expect-error – вызывающий сам знает, что ждёт
    return undefined;
  }

  return (await res.json()) as T;
}

/** Хелпер для формирования URL фото */
export function getApiFileUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (!API_BASE) return path;
  return `${API_BASE}${path}`;
}
