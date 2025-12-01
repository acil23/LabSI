// src/lib/http.js

const BACKEND_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:4000' 
  : window.location.origin;

// Base API relative ke domain (Plesk reverse proxy ke Node)
export const API_BASE = '/api';

export const asAbsolute = (p = '') => {
  const s = String(p).trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s) || s.startsWith('data:')) return s;

  // 2. Normalisasi Path
  let path = s.startsWith('/') ? s : `/${s}`;

  // 3. FIX PENTING: Penyesuaian path '/uploads'
  // Di server.js, kamu set statisnya di '/api/uploads'.
  // Jadi jika database menyimpan '/uploads/gambar.jpg', kita harus tambah '/api' di depannya.
  if (path.startsWith('/uploads')) {
    path = `/api${path}`; 
  }

  // 4. Gabungkan dengan URL Backend yang benar
  return `${BACKEND_URL}${path}`;
};



/** Helper request JSON (Fetch) */
async function request(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin',
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) throw new Error(data?.error || res.statusText);
  return data;
}

/** Upload file dengan FormData (tanpa Content-Type manual) */
export async function uploadForm(path, formData) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    body: formData,
    credentials: 'same-origin',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || res.statusText);
  return data;
}

/** Wrapper singkat */
export const http = {
  get:  (p)    => request(p),
  post: (p, b) => request(p, { method: 'POST',  body: b }),
  patch:(p, b) => request(p, { method: 'PATCH', body: b }),
  del:  (p)    => request(p, { method: 'DELETE' }),
  uploadForm,
};
