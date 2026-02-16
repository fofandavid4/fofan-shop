export async function apiFetch(opts: {
  path: string;
  method?: string;
  body?: any;
  headers?: HeadersInit;
}) {
  const { path, method = "GET", body, headers } = opts;

  try {
    const res = await fetch(path.startsWith("/") ? path : "/" + path, {
      method,
      body,
      headers,
    });

    if (!res.ok) {
      console.error("apiFetch error status:", res.status);
      throw new Error("Bad status " + res.status);
    }

    return res;
  } catch (e) {
    console.error("apiFetch exception:", e);
    throw e;
  }
}

export function getApiFileUrl(path: string) {
  if (!path.startsWith("/")) {
    path = "/" + path;
  }
  return path;
}
