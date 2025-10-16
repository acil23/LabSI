import { API_BASE } from "./http";

/* ========== BERITA ========== */
export async function getNews({ page = 1, perPage = 12, q = "", category = "", pinned } = {}) {
  const params = new URLSearchParams({ page, perPage });
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (typeof pinned !== "undefined") params.set("pinned", pinned ? "1" : "0");

  const r = await fetch(`${API_BASE}/news?${params}`);
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error || "Gagal memuat berita");
  return j; // {data, count, page, perPage}
}


export async function getNewsBySlug(slug) {
  const r = await fetch(`${API_BASE}/news/${slug}`);
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error || "Berita tidak ditemukan");
  return j;
}

/* ========== JURNAL ========== */
export async function getJournals({ page = 1, perPage = 9, q = "", year = "", type = "" } = {}) {
  const params = new URLSearchParams({ page, perPage });
  if (q) params.set("q", q);
  if (year) params.set("year", year);
  if (type) params.set("type", type);

  const r = await fetch(`${API_BASE}/journals?${params}`);
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Gagal memuat data jurnal");
  return j;
}

export async function getJournalBySlug(slug) {
  const r = await fetch(`${API_BASE}/journals/${slug}`);
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Jurnal tidak ditemukan");
  return j;
}

export async function adminCreateJournal(payload) {
  const r = await fetch(`${API_BASE}/admin/journals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Gagal menambah jurnal");
  return j; // {message, slug}
}

export async function adminUpdateJournal(slug, payload) {
  const r = await fetch(`${API_BASE}/admin/journals/${slug}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Gagal mengubah jurnal");
  return j;
}

export async function adminDeleteJournal(slug) {
  const r = await fetch(`${API_BASE}/admin/journals/${slug}`, { method: "DELETE" });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Gagal menghapus jurnal");
  return j;
}

// Anggota

export async function getMembers({ page = 1, perPage = 6 } = {}) {
  const r = await fetch(`${API_BASE}/members?page=${page}&perPage=${perPage}`);
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Gagal memuat anggota");
  return j; // {data, count, ...}
}

// Kolaborasi

export async function getCollaborations() {
  const r = await fetch(`${API_BASE}/collaborations`);
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Gagal memuat kolaborasi");
  return j;
}

export async function listCollaborationsAdmin({ page = 1, perPage = 10, q = "" } = {}) {
  const u = new URL(`${API_BASE}/collaborations/admin`);
  u.searchParams.set("page", page);
  u.searchParams.set("perPage", perPage);
  if (q) u.searchParams.set("q", q);
  const r = await fetch(u);
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Gagal memuat kolaborasi");
  return j; // {data, count, page, perPage}
}

export async function getCollaborationById(id) {
  const r = await fetch(`${API_BASE}/collaborations/admin/${id}`);
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Tidak ditemukan");
  return j;
}

export async function createCollaboration(payload) {
  const r = await fetch(`${API_BASE}/collaborations/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Gagal menambah kolaborasi");
  return j;
}

export async function updateCollaboration(id, payload) {
  const r = await fetch(`${API_BASE}/collaborations/admin/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Gagal memperbarui kolaborasi");
  return j;
}

export async function deleteCollaboration(id) {
  const r = await fetch(`${API_BASE}/collaborations/admin/${id}`, { method: "DELETE" });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Gagal menghapus kolaborasi");
  return j;
}

export async function uploadCollabLogo(file) {
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch(`${API_BASE}/uploads/collab/logo`, { method: "POST", body: fd });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Gagal mengunggah logo");
  return j; // { url, filename }
}
