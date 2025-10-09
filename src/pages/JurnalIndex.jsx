import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getJournals } from "../lib/api";
import { asAbsolute } from "../lib/http";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const VIEW_PER_PAGE = 8;

export default function JurnalIndex() {
  const [rawItems, setRawItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const qParam = searchParams.get("q") || "";
  const letterParam = searchParams.get("letter") || "";
  const yearParam = searchParams.get("year") || "";
  const typeParam = searchParams.get("type") || "";
  const pageParam = Number(searchParams.get("page") || 1);

  const [query, setQuery] = useState(qParam);
  const [letter, setLetter] = useState(letterParam);
  const [year, setYear] = useState(yearParam);
  const [type, setType] = useState(typeParam);
  const [page, setPage] = useState(pageParam);

  // Fetch data awal
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getJournals({ page: 1, perPage: 300 });
        setRawItems(res.data || []);
        setErr("");
      } catch (e) {
        setErr(e.message || "Gagal memuat jurnal");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Ambil daftar tahun unik untuk dropdown
  const availableYears = useMemo(() => {
    const years = new Set((rawItems || []).map((it) => it.year).filter(Boolean));
    return Array.from(years).sort((a, b) => b - a);
  }, [rawItems]);

  // Ambil daftar tipe unik (Journal, Conference, dsb.)
  const availableTypes = useMemo(() => {
    const types = new Set((rawItems || []).map((it) => it.type).filter(Boolean));
    return Array.from(types);
  }, [rawItems]);

  // Filter berdasarkan query, letter, year, type
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return (rawItems || []).filter((it) => {
      const title = (it.title || "").toLowerCase();
      const authors = (it.authors || "").toLowerCase();
      const first = (it.title || "").trim().charAt(0).toUpperCase();

      if (letter && first !== letter) return false;
      if (q && !title.includes(q) && !authors.includes(q)) return false;
      if (year && String(it.year) !== year) return false;
      if (type && it.type !== type) return false;

      return true;
    });
  }, [rawItems, query, letter, year, type]);

  // Pagination lokal
  const totalPages = Math.max(1, Math.ceil(filtered.length / VIEW_PER_PAGE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * VIEW_PER_PAGE;
    return filtered.slice(start, start + VIEW_PER_PAGE);
  }, [filtered, currentPage]);

  // Sinkron URL
  const syncURL = (next) => {
    const p = new URLSearchParams();
    if (next.q) p.set("q", next.q);
    if (next.letter) p.set("letter", next.letter);
    if (next.year) p.set("year", next.year);
    if (next.type) p.set("type", next.type);
    if (next.page && next.page !== 1) p.set("page", String(next.page));
    setSearchParams(p);
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    syncURL({ q: query, letter, year, type, page: 1 });
  };

  const onPickLetter = (ch) => {
    const newLetter = letter === ch ? "" : ch;
    setLetter(newLetter);
    setPage(1);
    syncURL({ q: query, letter: newLetter, year, type, page: 1 });
  };

  const onReset = () => {
    setQuery("");
    setLetter("");
    setYear("");
    setType("");
    setPage(1);
    syncURL({ q: "", letter: "", year: "", type: "", page: 1 });
  };

  const go = (p) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    syncURL({ q: query, letter, year, type, page: next });
  };

  if (loading) {
    return (
      <section className="section section-dark text-center">
        <p className="text-white-80">Memuat data jurnal...</p>
      </section>
    );
  }

  if (err) {
    return (
      <section className="section section-dark text-center">
        <p className="text-danger">{err}</p>
      </section>
    );
  }

  return (
    <section className="section section-dark">
      <div className="container">
        <h2 className="text-center text-light mb-4">
          Daftar Publikasi Jurnal & Konferensi
        </h2>

        {/* 🔍 Filter Section */}
        <div className="card card-dark p-3 mb-4">
          <form onSubmit={onSearchSubmit}>
            <div className="row g-2 align-items-center mb-3">
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Cari judul atau penulis..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="">Semua Tahun</option>
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Semua Tipe</option>
                  {availableTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2 d-flex gap-2">
                <button type="submit" className="btn btn-info w-100">
                  Cari
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={onReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>

          {/* 🔤 Filter A–Z */}
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn ${!letter ? "btn-info" : "btn-outline-info"}`}
              onClick={() => onPickLetter("")}
            >
              Semua
            </button>
            {LETTERS.map((ch) => (
              <button
                key={ch}
                type="button"
                className={`btn rounded-pill ${
                  letter === ch ? "btn-info" : "btn-outline-info"
                }`}
                style={{ minWidth: 44 }}
                onClick={() => onPickLetter(ch)}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        {/* 📄 Daftar Jurnal */}
        <div className="row">
          {pagedItems.map((j) => (
            <div className="col-md-6 mb-4" key={j.slug}>
              <div className="card card-dark h-100">
                {j.thumb_url && (
                  <img
                    src={asAbsolute(j.thumb_url)}
                    alt={j.title}
                    className="img-fluid rounded-top"
                    style={{ maxHeight: 200, objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h4 className="text-light mb-2">{j.title}</h4>
                  <p className="text-white-80 mb-1">{j.authors}</p>
                  <p className="text-info mb-2">
                    {j.venue} • {j.year} ({j.type})
                  </p>
                  <div className="d-flex gap-2">
                    <Link
                      to={`/jurnal/${j.slug}`}
                      className="btn btn-outline-info btn-sm"
                    >
                      Baca Detail
                    </Link>
                    {j.pdf_url && (
                      <a
                        href={asAbsolute(j.pdf_url)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-info btn-sm"
                      >
                        ⬇️ Download PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!pagedItems.length && (
            <div className="col-12">
              <div className="card card-dark p-4 text-center">
                <p className="text-white-80 m-0">
                  Tidak ada hasil untuk filter saat ini.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 🔢 Pagination */}
        {totalPages > 1 && (
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center mt-4">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => go(currentPage - 1)}>
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <li key={p} className={`page-item ${p === currentPage ? "active" : ""}`}>
                  <button className="page-link" onClick={() => go(p)}>
                    {p}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button className="page-link" onClick={() => go(currentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
}
