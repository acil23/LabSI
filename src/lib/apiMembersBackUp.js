import { supabase } from './supabaseClient';

// List + filter + pagination (server-side range)
export async function listMembers({ page = 1, perPage = 6, filters = {} } = {}) {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from('members')
    .select(`
      id, slug, name, title, position, faculty, program, email, avatar_url,
      member_specialists (
        spec:specialists ( name )
      ),
      skills ( skill_name )
    `, { count: 'exact' })
    .order('position', { ascending: false })
    .order('name', { ascending: true })
    .range(from, to);

  if (filters.position) query = query.eq('position', filters.position);
  if (filters.faculty)  query = query.eq('faculty', filters.faculty);
  if (filters.program)  query = query.eq('program', filters.program);
  if (filters.q) {
    // Cari di name atau specialist (pakai ilike)
    query = query.ilike('name', `%${filters.q}%`);
    // Catatan: untuk cari di specialists/skills, lebih enak pakai view atau RPC khusus.
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return { data, count, totalPages: Math.max(1, Math.ceil((count || 0) / perPage)) };
}

// Detail berdasarkan slug + semua relasi
export async function getMemberDetailBySlug(slug) {
  const { data, error } = await supabase
    .from('members')
    .select(`
      id, slug, name, title, position, faculty, program, email, avatar_url, bio, created_at,
      member_specialists ( spec:specialists ( name ) ),
      skills ( skill_name ),
      certifications ( cert_name ),
      experiences ( role, org, period, bullets ),
      educations ( degree, org, year, note ),
      socials ( type, url )
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

// Opsi: ambil opsi filter unik (jabatan/fakultas/prodi)
export async function getMemberFilterOptions() {
  const { data, error } = await supabase
    .from('members')
    .select('position, faculty, program');
  if (error) throw error;

  const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)));
  return {
    positions: uniq(data.map(d => d.position)),
    faculties: uniq(data.map(d => d.faculty)),
    programs : uniq(data.map(d => d.program)),
  };
}
