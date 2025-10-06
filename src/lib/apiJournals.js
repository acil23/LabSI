// sementara baca dari public/data/journals.json
async function loadAll() {
  const res = await fetch('/data/journals.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Gagal memuat data jurnal');
  const list = await res.json();
  // Normalisasi minimal
  return list.map((j, idx) => ({
    id: j.id ?? idx + 1,
    slug: j.slug ?? (j.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: j.title,
    authors: j.authors || [],
    affiliations: j.affiliations || [],
    abstract: j.abstract || '',
    keywords: j.keywords || [],
    publisher: j.publisher || '',
    year: j.year || '',
    pdfUrl: j.pdfUrl || '',
    sections: j.sections || [],      // e.g. [{heading:'Pendahuluan', body:'...'}]
    references: j.references || [],  // array string
  }));
}

export async function listJournals({ q = '', letter = '', page = 1, perPage = 10 } = {}) {
  const all = await loadAll();

  let rows = all;
  if (q) {
    const s = q.toLowerCase();
    rows = rows.filter(r =>
      (r.title || '').toLowerCase().includes(s) ||
      (r.authors || []).join(' ').toLowerCase().includes(s)
    );
  }
  if (letter) {
    rows = rows.filter(r => (r.title || '').trim().toUpperCase().startsWith(letter.toUpperCase()));
  }

  const total = rows.length;
  const start = (page - 1) * perPage;
  const data = rows.slice(start, start + perPage);

  return { data, total, page, perPage, totalPages: Math.max(1, Math.ceil(total / perPage)) };
}

export async function getJournalBySlug(slug) {
  const all = await loadAll();
  return all.find(j => j.slug === slug) || null;
}
