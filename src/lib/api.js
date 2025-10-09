import { API_BASE } from "./http";

/* ========== BERITA ========== */
export async function getNews({ page = 1, perPage = 6, q = "", category = "" } = {}) {
  const params = new URLSearchParams({ page, perPage });
  if (q) params.set("q", q);
  if (category) params.set("category", category);

  const r = await fetch(`${API_BASE}/news?${params}`);
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error || "Gagal memuat berita");
  return j;
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
