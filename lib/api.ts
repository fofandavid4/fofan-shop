export async function apiFetch(opts: {
  path: string;
  method?: string;
  body?: any;
}) {
  const { path, method = "GET", body } = opts;

  try {
    const res = await fetch(path.startsWith("/") ? path : "/" + path, {
      method,
      body,
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
