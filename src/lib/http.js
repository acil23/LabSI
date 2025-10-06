export const API_BASE = process.env.API_BASE || 'http://localhost:4000';

async function request(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error(data?.error || res.statusText);
  return data;
}

export async function uploadForm(path, formData) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || res.statusText);
  return data;
}
export const http = { get: (p)=>request(p), post:(p,b)=>request(p,{method:'POST',body:b}), patch:(p,b)=>request(p,{method:'PATCH',body:b}), del:(p)=>request(p,{method:'DELETE'}), uploadForm };

export const asAbsolute = (u) =>
  !u ? "" : (u.startsWith("http") ? u : `${API_BASE}${u}`);
