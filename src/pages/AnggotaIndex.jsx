// src/pages/AnggotaIndex.jsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listMembers } from "../lib/apiMembers";

const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)));

export default function AnggotaIndex() {
  const [items, setItems] = useState([]);
  const [opts, setOpts]   = useState({ positions: [], faculties: [], programs: [] });
  const [err, setErr]     = useState("");
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = Number(searchParams.get("page") || 1);
  const [page, setPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);

  const [jabatan, setJabatan]   = useState(searchParams.get("jabatan") || "");
  const [fakultas, setFakultas] = useState(searchParams.get("fakultas") || "");
  const [prodi, setProdi]       = useState(searchParams.get("prodi") || "");
  const [q, setQ]               = useState(searchParams.get("q") || "");

  const perPage = 6;

  async function load() {
    try {
      setLoading(true);
      const { data, count } = await listMembers({
        page,
        perPage,
        filters: { position: jabatan, faculty: fakultas, program: prodi, q },
      });

      setItems(data || []);
      setTotalPages(Math.max(1, Math.ceil((count || 0) / perPage)));

      // build opsi filter dari data yg ada di halaman saat ini
      const positions = uniq((data || []).map(d => d.position));
      const faculties = uniq((data || []).map(d => d.faculty));
      const programs  = uniq((data || []).map(d => d.program));
      setOpts({ positions, faculties, programs });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // sinkronisasi page dari URL kalau user klik pagination
    setPage(pageFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageFromUrl, jabatan, fakultas, prodi, q]);

  const go = (p) => {
    const next = Math.min(Math.max(1, p), totalPages);
    const params = {};
    if (next !== 1) params.page = String(next);
    if (jabatan) params.jabatan = jabatan;
    if (fakultas) params.fakultas = fakultas;
    if (prodi) params.prodi = prodi;
    if (q) params.q = q;
    setSearchParams(params);
  };

  const onChangeFilter = (setter, name) => (e) => {
    setter(e.target.value);
    const p = { page: "1", jabatan, fakultas, prodi, q, [name]: e.target.value };
    Object.keys(p).forEach((k) => !p[k] && delete p[k]);
    setSearchParams(p);
  };

  if (err) return <section className="section section-dark"><p className="text-danger">{err}</p></section>;

  return (
    <section className="section section-dark">
      <h2 className="section-title text-center mb-4">Direktori Anggota</h2>

      {/* Filter bar */}
      <div className="row g-2 align-items-center mb-4">
        <div className="col-md-3">
          <select name="jabatan" value={jabatan} onChange={onChangeFilter(setJabatan, "jabatan")} className="form-select bg-dark text-light border-secondary">
            <option value="">Jabatan</option>
            {opts.positions.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <select name="fakultas" value={fakultas} onChange={onChangeFilter(setFakultas, "fakultas")} className="form-select bg-dark text-light border-secondary">
            <option value="">Fakultas</option>
            {opts.faculties.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <select name="prodi" value={prodi} onChange={onChangeFilter(setProdi, "prodi")} className="form-select bg-dark text-light border-secondary">
            <option value="">Prodi</option>
            {opts.programs.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <input
            className="form-control bg-dark text-light border-secondary"
            placeholder="Search..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") go(1); }}
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-center">Loading…</p>
      ) : (
        <>
          <div className="row">
            {items.map((m) => (
              <div className="col-md-6 mb-4" key={m.id}>
                <div className="card card-dark p-3 h-100">
                  <div className="d-flex gap-3">
                    <img src={m.avatar_url} alt={m.name} className="rounded-circle" style={{ width: 80, height: 80, objectFit: "cover" }} />
                    <div className="flex-grow-1">
                      <small className="text-tanggal d-block mb-1">{m.position}</small>
                      <h5 className="mb-1 text-light">
                        {m.name} {m.title ? <span className="fw-normal">— {m.title}</span> : null}
                      </h5>
                      <div className="mb-2">
                        {(m.member_specialists || [])
                          .map((ms) => ms.spec?.name)
                          .filter(Boolean)
                          .slice(0, 3)
                          .map((s) => (
                            <span key={s} className="badge rounded-pill bg-primary me-1">{s}</span>
                          ))}
                      </div>
                      {m.email && <a href={`mailto:${m.email}`} className="text-info text-decoration-none">{m.email}</a>}
                      <div className="mt-2">
                        <Link to={`/anggota/${m.slug}`} className="btn btn-sm btn-outline-light">Lihat Profil</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!items.length && <p className="text-center">Tidak ada hasil.</p>}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Navigasi halaman">
              <ul className="pagination justify-content-center mt-4">
                <li className={`page-item ${pageFromUrl === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => go(pageFromUrl - 1)}>Previous</button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <li key={p} className={`page-item ${p === pageFromUrl ? "active" : ""}`}>
                    <button className="page-link" onClick={() => go(p)}>{p}</button>
                  </li>
                ))}
                <li className={`page-item ${pageFromUrl === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => go(pageFromUrl + 1)}>Next</button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
