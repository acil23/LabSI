// src/pages/AnggotaIndex.jsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listMembers } from "../lib/apiMembers";
import { motion, AnimatePresence } from "framer-motion";

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

  if (err) return (
    <section className="section section-dark">
      <motion.p 
        className="text-danger text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {err}
      </motion.p>
    </section>
  );

  return (
    <section className="section section-dark">
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
            👥 OUR TEAM
          </span>
        </motion.div>
        
        <h2 className="section-title mb-3" style={{ fontSize: '2.5rem' }}>
          Direktori <span className="text-info">Anggota</span>
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
          Temukan dan kenali anggota tim kami
        </motion.p>
      </motion.div>

      {/* Filter bar */}
      <motion.div 
        className="mb-5"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div 
          className="p-4 rounded-4 mb-4"
          style={{ 
            background: 'rgba(23, 162, 184, 0.05)',
            border: '1px solid rgba(23, 162, 184, 0.2)'
          }}
        >
          <div className="row g-3 align-items-center">
            <motion.div className="col-md-3" variants={fadeInUp}>
              <label className="small text-info mb-2 d-block fw-semibold">🏢 Jabatan</label>
              <motion.select 
                name="jabatan" 
                value={jabatan} 
                onChange={onChangeFilter(setJabatan, "jabatan")} 
                className="form-select bg-dark text-light border-secondary"
                style={{ borderRadius: '10px' }}
                whileFocus={{ scale: 1.02, borderColor: '#17a2b8' }}
              >
                <option value="">Semua Jabatan</option>
                {opts.positions.map((v) => <option key={v} value={v}>{v}</option>)}
              </motion.select>
            </motion.div>
            
            <motion.div className="col-md-3" variants={fadeInUp}>
              <label className="small text-info mb-2 d-block fw-semibold">🎓 Fakultas</label>
              <motion.select 
                name="fakultas" 
                value={fakultas} 
                onChange={onChangeFilter(setFakultas, "fakultas")} 
                className="form-select bg-dark text-light border-secondary"
                style={{ borderRadius: '10px' }}
                whileFocus={{ scale: 1.02, borderColor: '#17a2b8' }}
              >
                <option value="">Semua Fakultas</option>
                {opts.faculties.map((v) => <option key={v} value={v}>{v}</option>)}
              </motion.select>
            </motion.div>
            
            <motion.div className="col-md-3" variants={fadeInUp}>
              <label className="small text-info mb-2 d-block fw-semibold">📚 Prodi</label>
              <motion.select 
                name="prodi" 
                value={prodi} 
                onChange={onChangeFilter(setProdi, "prodi")} 
                className="form-select bg-dark text-light border-secondary"
                style={{ borderRadius: '10px' }}
                whileFocus={{ scale: 1.02, borderColor: '#17a2b8' }}
              >
                <option value="">Semua Prodi</option>
                {opts.programs.map((v) => <option key={v} value={v}>{v}</option>)}
              </motion.select>
            </motion.div>
            
            <motion.div className="col-md-3" variants={fadeInUp}>
              <label className="small text-info mb-2 d-block fw-semibold">🔍 Search</label>
              <motion.input
                className="form-control bg-dark text-light border-secondary"
                style={{ borderRadius: '10px' }}
                placeholder="Cari nama..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") go(1); }}
                whileFocus={{ scale: 1.02, borderColor: '#17a2b8' }}
              />
            </motion.div>
          </div>
          
          {/* Active filters indicator */}
          {(jabatan || fakultas || prodi || q) && (
            <motion.div 
              className="mt-3 d-flex gap-2 flex-wrap"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <span className="small text-white-50">Filter aktif:</span>
              {jabatan && (
                <motion.span 
                  className="badge bg-info text-dark"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {jabatan} ✕
                </motion.span>
              )}
              {fakultas && (
                <motion.span 
                  className="badge bg-info text-dark"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {fakultas} ✕
                </motion.span>
              )}
              {prodi && (
                <motion.span 
                  className="badge bg-info text-dark"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {prodi} ✕
                </motion.span>
              )}
              {q && (
                <motion.span 
                  className="badge bg-info text-dark"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  "{q}" ✕
                </motion.span>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <motion.div 
          className="text-center py-5"
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
          <p className="text-white-50 mt-3">Memuat data anggota...</p>
        </motion.div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div 
              className="row"
              key={pageFromUrl}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {items.map((m, index) => (
                <motion.div 
                  className="col-md-6 mb-4" 
                  key={m.id}
                  variants={cardVariant}
                  custom={index}
                >
                  <motion.div 
                    className="card card-dark p-4 h-100"
                    style={{ 
                      borderRadius: '16px',
                      border: '1px solid rgba(23, 162, 184, 0.2)',
                      background: 'rgba(23, 162, 184, 0.03)'
                    }}
                    whileHover={{ 
                      y: -8,
                      boxShadow: '0 20px 40px rgba(23, 162, 184, 0.2)',
                      borderColor: 'rgba(23, 162, 184, 0.4)',
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className="d-flex gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img 
                          src={m.avatar_url} 
                          alt={m.name} 
                          className="rounded-circle" 
                          style={{ 
                            width: 90, 
                            height: 90, 
                            objectFit: "cover",
                            border: '3px solid rgba(23, 162, 184, 0.3)'
                          }} 
                        />
                      </motion.div>
                      
                      <div className="flex-grow-1">
                        <small className="text-info d-block mb-1 fw-semibold" style={{ fontSize: '0.8rem' }}>
                          {m.position || 'Member'}
                        </small>
                        
                        <h5 className="mb-2 text-light" style={{ fontSize: '1.2rem' }}>
                          {m.name}
                          {m.title && (
                            <span className="fw-normal text-white-50" style={{ fontSize: '0.9rem' }}>
                              {' '}— {m.title}
                            </span>
                          )}
                        </h5>
                        
                        {/* Specialist badges */}
                        <div className="mb-2 d-flex flex-wrap gap-1">
                          {(m.member_specialists || [])
                            .map((ms) => ms.spec?.name)
                            .filter(Boolean)
                            .slice(0, 3)
                            .map((s) => (
                              <motion.span 
                                key={s} 
                                className="badge rounded-pill bg-primary"
                                style={{ fontSize: '0.7rem' }}
                                whileHover={{ scale: 1.1 }}
                              >
                                {s}
                              </motion.span>
                            ))}
                        </div>
                        
                        {m.email && (
                          <motion.a 
                            href={`mailto:${m.email}`} 
                            className="text-info text-decoration-none d-block mb-3"
                            style={{ fontSize: '0.85rem' }}
                            whileHover={{ x: 5, color: '#17a2b8' }}
                          >
                            ✉️ {m.email}
                          </motion.a>
                        )}
                        
                        <motion.div
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link 
                            to={`/anggota/${m.slug}`} 
                            className="btn btn-sm btn-info text-dark fw-semibold"
                            style={{ borderRadius: '8px' }}
                          >
                            Lihat Profil →
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
              
              {!items.length && (
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
                    <h5 className="text-white-50 mt-3">Tidak ada hasil ditemukan</h5>
                    <p className="text-white-50 small">Coba ubah filter atau kata kunci pencarian</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.nav 
              aria-label="Navigasi halaman"
              className="mt-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ul className="pagination justify-content-center">
                <motion.li 
                  className={`page-item ${pageFromUrl === 1 ? "disabled" : ""}`}
                  whileHover={pageFromUrl !== 1 ? { scale: 1.05 } : {}}
                >
                  <button 
                    className="page-link bg-dark text-info border-secondary"
                    onClick={() => go(pageFromUrl - 1)}
                    style={{ borderRadius: '8px 0 0 8px' }}
                  >
                    ← Previous
                  </button>
                </motion.li>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <motion.li 
                    key={p} 
                    className={`page-item ${p === pageFromUrl ? "active" : ""}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button 
                      className={`page-link ${p === pageFromUrl ? 'bg-info text-dark border-info' : 'bg-dark text-light border-secondary'}`}
                      onClick={() => go(p)}
                    >
                      {p}
                    </button>
                  </motion.li>
                ))}
                
                <motion.li 
                  className={`page-item ${pageFromUrl === totalPages ? "disabled" : ""}`}
                  whileHover={pageFromUrl !== totalPages ? { scale: 1.05 } : {}}
                >
                  <button 
                    className="page-link bg-dark text-info border-secondary"
                    onClick={() => go(pageFromUrl + 1)}
                    style={{ borderRadius: '0 8px 8px 0' }}
                  >
                    Next →
                  </button>
                </motion.li>
              </ul>
            </motion.nav>
          )}
        </>
      )}
    </section>
  );
}
