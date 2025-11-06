// src/lib/apiMembers.js
import { http } from './http';

// LIST + filter + pagination (ke backend)
export async function listMembers({ page = 1, perPage = 6, filters = {} } = {}) {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('perPage', perPage);
  if (filters.position) params.set('position', filters.position);
  if (filters.faculty)  params.set('faculty',  filters.faculty);
  if (filters.program)  params.set('program',  filters.program);
  if (filters.q)        params.set('q',        filters.q); // ⬅️ backend pakai "q", bukan "search"

  return http.get(`/members?${params.toString()}`);
}

// DETAIL by slug
export function getMemberDetailBySlug(slug) {
  return http.get(`/members/${slug}`);
}

// Upload avatar (FormData: file + optional slug)
export function uploadAvatar(file, slug) {
  const fd = new FormData();
  fd.append('file', file);
  if (slug) fd.append('slug', slug);
  return http.uploadForm('/uploads/avatar', fd); // -> { url, path }
}

// (untuk admin nanti)
export const createMember        = (payload)        => http.post(`/members`, payload);
export const updateMember        = (slug, payload)  => http.patch(`/members/${slug}`, payload);
export const deleteMember        = (slug)           => http.del(`/members/${slug}`);
