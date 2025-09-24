// src/lib/api.js
const _cache = new Map();

export async function fetchJSON(path) {
  if (_cache.has(path)) return _cache.get(path);
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Gagal memuat ${path}: ${res.status}`);
  const data = await res.json();
  _cache.set(path, data);
  return data;
}

export const getNews = async () => {
  const arr = await fetchJSON("/data/news.json");
  return arr.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getNewsBySlug = async (slug) => {
  const arr = await getNews();
  return arr.find((n) => n.slug === slug) || null;
};

// ==== Members ====
export const getMembers = async () => {
  const arr = await fetchJSON("/data/members.json");
  // sort by position > name biar konsisten
  return arr.slice().sort((a, b) => (a.position > b.position ? -1 : 1) || a.name.localeCompare(b.name));
};

export const getMemberBySlug = async (slug) => {
  const arr = await getMembers();
  return arr.find((m) => m.slug === slug) || null;
};
