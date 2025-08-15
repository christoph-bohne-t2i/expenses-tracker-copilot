export async function api<T>(path: string, init: RequestInit = {}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    credentials: 'include',
  });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const b = await res.json();
      msg = b.message || b.title || msg;
    } catch {}
    throw new Error(`${res.status} ${msg}`);
  }
  return (res.status === 204 ? null : (res.json() as Promise<T>)) as T;
}
