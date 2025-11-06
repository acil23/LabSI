// src/lib/apiJournals.js
import { http } from './http';

export function listJournals({ q = '', letter = '', page = 1, perPage = 10 } = {}) {
  const params = new URLSearchParams({ page, perPage });
  if (q) params.set('q', q);
  if (letter) params.set('letter', letter); // kalau backend belum support letter, abaikan
  return http.get(`/journals?${params.toString()}`);
}

export function getJournalBySlug(slug) {
  return http.get(`/journals/${slug}`);
}
