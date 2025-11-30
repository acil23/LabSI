import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getJournals } from "../lib/api";
import { asAbsolute } from "../lib/http";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { t } from "../translations/translations";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const VIEW_PER_PAGE = 8;

export default function JurnalIndex() {
  const { lang } = useLanguage();
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

  // Ambil daftar tipe unik
  const availableTypes = useMemo(() => {
    const types = new Set((rawItems || []).map((it) => it.type).filter(Boolean));
    return Array.from(types);
  }, [rawItems]);

  // Filter
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

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  };

  if (loading) {
    return (
      <section className="section section-dark text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ display: 'inline-block' }}
          >
            <div 
              className="spinner-border text-info" 
              role="status"
              style={{ width: '3rem', height: '3rem' }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </motion.div>
          <p className="text-white-50 mt-3">{t(lang, 'publications.loading')}</p>
        </motion.div>
      </section>
    );
  }

  if (err) {
    return (
      <section className="section section-dark text-center">
        <motion.p 
          className="text-danger"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {err}
        </motion.p>
      </section>
    );
  }

  return (
    <section className="section section-dark">
      <div className="container">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <motion.div
            className="d-inline-block mb-3"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="badge bg-info text-dark px-4 py-2" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
              📚 {t(lang, 'publications.badge')}
            </span>
          </motion.div>
          
          <h2 className="section-title mb-3" style={{ fontSize: '2.5rem' }}>
            {t(lang, 'publications.title')} <span className="text-info">{t(lang, 'publications.title_highlight')}</span>
          </h2>
          
          <motion.div 
            className="mx-auto"
            style={{ 
              width: '80px', 
              height: '4px', 
              background: 'linear-gradient(90deg, transparent, #17a2b8, transparent)',
              borderRadius: '2px'
            }}
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          
          <motion.p 
            className="text-white-50 mt-3"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            {t(lang, 'publications.subtitle')}
          </motion.p>
        </motion.div>

        {/* 🔍 Filter Section */}
        <motion.div 
          className="card card-dark p-4 mb-5"
          style={{ 
            borderRadius: '20px',
            border: '1px solid rgba(23, 162, 184, 0.2)',
            background: 'rgba(23, 162, 184, 0.05)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={onSearchSubmit}>
            <div className="row g-3 align-items-center mb-4">
              <div className="col-md-5">
                <label className="small text-info mb-2 d-block fw-semibold">🔍 {t(lang, 'publications.filter_search')}</label>
                <motion.input
                  className="form-control bg-dark text-light border-secondary"
                  style={{ borderRadius: '10px' }}
                  placeholder="{t(lang, 'publications.filter_search_placeholder')}"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  whileFocus={{ scale: 1.02, borderColor: '#17a2b8' }}
                />
              </div>
              <div className="col-md-2">
                <label className="small text-info mb-2 d-block fw-semibold">📅 {t(lang, 'publications.filter_year')}</label>
                <motion.select
                  className="form-select bg-dark text-light border-secondary"
                  style={{ borderRadius: '10px' }}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  whileFocus={{ scale: 1.02, borderColor: '#17a2b8' }}
                >
                  <option value="">{t(lang, 'publications.filter_all_years')}</option>
                  {availableYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </motion.select>
              </div>
              <div className="col-md-2">
                <label className="small text-info mb-2 d-block fw-semibold">📝 {t(lang, 'publications.filter_type')}</label>
                <motion.select
                  className="form-select bg-dark text-light border-secondary"
                  style={{ borderRadius: '10px' }}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  whileFocus={{ scale: 1.02, borderColor: '#17a2b8' }}
                >
                  <option value="">{t(lang, 'publications.filter_all_types')}</option>
                  {availableTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </motion.select>
              </div>
              <div className="col-md-3 d-flex gap-2 align-items-end">
                <motion.button 
                  type="submit" 
                  className="btn btn-info text-dark fw-semibold flex-grow-1"
                  style={{ borderRadius: '10px', marginTop: 'auto' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t(lang, 'publications.btn_search')}
                </motion.button>
                <motion.button
                  type="button"
                  className="btn btn-outline-light"
                  style={{ borderRadius: '10px' }}
                  onClick={onReset}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t(lang, 'publications.btn_reset')}
                </motion.button>
              </div>
            </div>
          </form>

          {/* 🔤 Filter A–Z */}
          <div>
            <label className="small text-info mb-2 d-block fw-semibold">🔤 {t(lang, 'publications.filter_alphabet')}</label>
            <div className="d-flex flex-wrap gap-2">
              <motion.button
                type="button"
                className={`btn ${!letter ? "btn-info text-dark" : "btn-outline-info"}`}
                style={{ borderRadius: '8px', minWidth: '50px' }}
                onClick={() => onPickLetter("")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {t(lang, 'publications.btn_all')}
              </motion.button>
              {LETTERS.map((ch) => (
                <motion.button
                  key={ch}
                  type="button"
                  className={`btn ${letter === ch ? "btn-info text-dark" : "btn-outline-info"}`}
                  style={{ minWidth: 40, borderRadius: '8px' }}
                  onClick={() => onPickLetter(ch)}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {ch}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Active filters */}
          {(query || letter || year || type) && (
            <motion.div 
              className="mt-3 p-3 rounded"
              style={{ background: 'rgba(23, 162, 184, 0.1)' }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <small className="text-info fw-semibold">{t(lang, 'members.filter_active')}: </small>
              <span className="text-white">{filtered.length} {t(lang, 'publications.results_found')}</span>
            </motion.div>
          )}
        </motion.div>

        {/* 📄 Daftar Jurnal */}
        <AnimatePresence mode="wait">
          <motion.div 
            className="row"
            key={currentPage}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {pagedItems.map((j, index) => (
              <motion.div 
                className="col-md-6 mb-4" 
                key={j.slug}
                variants={cardVariant}
                custom={index}
              >
                <motion.div 
                  className="card card-dark h-100"
                  style={{ 
                    borderRadius: '16px',
                    border: '1px solid rgba(23, 162, 184, 0.2)',
                    background: 'rgba(23, 162, 184, 0.03)',
                    overflow: 'hidden'
                  }}
                  whileHover={{ 
                    y: -8,
                    boxShadow: '0 20px 40px rgba(23, 162, 184, 0.2)',
                    borderColor: 'rgba(23, 162, 184, 0.4)',
                    transition: { duration: 0.3 }
                  }}
                >
                  {j.thumb_url && (
                    <motion.div
                      className="overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={asAbsolute(j.thumb_url)}
                        alt={j.title}
                        className="img-fluid w-100"
                        style={{ maxHeight: 200, objectFit: "cover" }}
                      />
                    </motion.div>
                  )}
                  <div className="card-body">
                    <h4 className="text-light mb-2" style={{ fontSize: '1.1rem', lineHeight: '1.4' }}>
                      {j.title}
                    </h4>
                    <p className="text-white-80 mb-2 small">{j.authors}</p>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <span className="badge bg-info text-dark">
                        📅 {j.year}
                      </span>
                      <span className="badge bg-dark text-info">
                        {j.type}
                      </span>
                    </div>
                    <p className="text-white-50 small mb-3">{j.venue}</p>
                    <div className="d-flex gap-2">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to={`/jurnal/${j.slug}`}
                          className="btn btn-outline-info btn-sm"
                          style={{ borderRadius: '8px' }}
                        >
                          {t(lang, 'publications.btn_detail')}
                        </Link>
                      </motion.div>
                      {j.pdf_url && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <a
                            href={asAbsolute(j.pdf_url)}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-info btn-sm text-dark"
                            style={{ borderRadius: '8px' }}
                          >
                            ⬇️ {t(lang, 'publications.btn_download')}
                          </a>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}

            {!pagedItems.length && (
              <motion.div 
                className="col-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div 
                  className="text-center py-5"
                  style={{ 
                    background: 'rgba(23, 162, 184, 0.05)',
                    borderRadius: '16px',
                    border: '1px dashed rgba(23, 162, 184, 0.3)'
                  }}
                >
                  <div style={{ fontSize: '3rem' }}>🔍</div>
                  <h5 className="text-white-50 mt-3">{t(lang, 'publications.no_results')}</h5>
                  <p className="text-white-50 small">{t(lang, 'publications.no_results_desc')}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 🔢 Pagination */}
        {totalPages > 1 && (
          <motion.nav 
            aria-label="Page navigation"
            className="mt-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ul className="pagination justify-content-center">
              <motion.li 
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
              >
                <button 
                  className="page-link bg-dark text-info border-secondary"
                  onClick={() => go(currentPage - 1)}
                  style={{ borderRadius: '8px 0 0 8px' }}
                >
                  ← Previous
                </button>
              </motion.li>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <motion.li 
                  key={p} 
                  className={`page-item ${p === currentPage ? "active" : ""}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button 
                    className={`page-link ${p === currentPage ? 'bg-info text-dark border-info' : 'bg-dark text-light border-secondary'}`}
                    onClick={() => go(p)}
                  >
                    {p}
                  </button>
                </motion.li>
              ))}
              
              <motion.li 
                className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
              >
                <button 
                  className="page-link bg-dark text-info border-secondary"
                  onClick={() => go(currentPage + 1)}
                  style={{ borderRadius: '0 8px 8px 0' }}
                >
                  Next →
                </button>
              </motion.li>
            </ul>
          </motion.nav>
        )}
      </div>
    </section>
  );
}
