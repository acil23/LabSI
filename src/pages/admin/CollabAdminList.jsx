import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCollaborationsAdmin, deleteCollaboration } from "../../lib/api";
import { asAbsolute } from "../../lib/http";
import AdminGate from "../../components/adminGate";
import { motion, AnimatePresence } from "framer-motion";

export default function CollabAdminList() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await listCollaborationsAdmin({ page, perPage, q });
      setItems(res.data || []);
      setCount(res.count || 0);
      setErr("");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, q]);

  const onDelete = async (id) => {
    if (!window.confirm("Hapus kolaborasi ini?")) return;
    try {
      await deleteCollaboration(id);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const totalPages = Math.max(1, Math.ceil(count / perPage));

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
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

  if (loading && page === 1) return (
    <AdminGate>
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
            <div className="spinner-border text-info" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </motion.div>
          <p className="text-white-50 mt-3">Memuat kolaborasi...</p>
        </motion.div>
      </section>
    </AdminGate>
  );

  return (
    <AdminGate>
      <section className="section section-dark">
        {/* Header */}
        <motion.div
          className="d-flex justify-content-between align-items-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
            <Link to="/admin" className="btn btn-warning">
              ← Kembali
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="section-title m-0 d-flex align-items-center gap-2">
              <span style={{ fontSize: '1.5rem' }}>🤝</span>
              Kelola Kolaborasi
            </h2>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/admin/kolaborasi/new" className="btn btn-info">
              + Tambah
            </Link>
          </motion.div>
        </motion.div>

        {/* Search & Stats Bar */}
        <motion.div 
          className="card card-dark p-3 mb-4"
          style={{ 
            borderRadius: '16px',
            border: '1px solid rgba(23, 162, 184, 0.3)',
            background: 'rgba(23, 162, 184, 0.05)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="row g-3 align-items-center">
            <div className="col-md-8">
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: '1.2rem' }}>🔍</span>
                <motion.input
                  value={q}
                  onChange={(e) => { setPage(1); setQ(e.target.value); }}
                  placeholder="Cari nama atau organisasi..."
                  className="form-control bg-dark text-light border-secondary"
                  style={{ borderRadius: '10px' }}
                  whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
                />
              </div>
            </div>
            <div className="col-md-4 text-end">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-white-50 small">Total: </span>
                <span className="text-info fw-bold h5 mb-0">{count}</span>
                <span className="text-white-50 small"> kolaborasi</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {loading && page !== 1 && (
          <motion.p 
            className="text-white-80 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Memuat...
          </motion.p>
        )}
        {err && <p className="text-danger">{err}</p>}

        {/* Grid Cards */}
        <AnimatePresence mode="wait">
          <motion.div 
            className="row"
            key={page}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {items.map((c, index) => (
              <motion.div 
                className="col-md-6 col-lg-4 mb-4" 
                key={c.id}
                variants={cardVariant}
                custom={index}
              >
                <motion.div 
                  className="card card-dark h-100 p-4"
                  style={{ 
                    borderRadius: '16px',
                    border: '1px solid rgba(23, 162, 184, 0.3)',
                    background: 'rgba(23, 162, 184, 0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  whileHover={{ 
                    y: -8,
                    boxShadow: '0 20px 40px rgba(23, 162, 184, 0.2)',
                    borderColor: 'rgba(23, 162, 184, 0.5)',
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Decorative element */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: '-30px',
                      right: '-30px',
                      width: '100px',
                      height: '100px',
                      background: 'radial-gradient(circle, rgba(23, 162, 184, 0.1), transparent)',
                      borderRadius: '50%',
                      zIndex: 0
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                  />

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Logo */}
                    <div className="d-flex align-items-center gap-3 mb-3">
                      {c.logo_url ? (
                        <motion.div
                          className="d-flex align-items-center justify-content-center"
                          style={{ 
                            minWidth: 80,
                            height: 80,
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '12px',
                            padding: '8px',
                            border: '2px solid rgba(23, 162, 184, 0.3)'
                          }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <img 
                            src={asAbsolute(c.logo_url)} 
                            alt={c.name}
                            style={{ 
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'contain'
                            }}
                          />
                        </motion.div>
                      ) : (
                        <div 
                          className="d-flex align-items-center justify-content-center"
                          style={{ 
                            width: 80,
                            height: 80,
                            background: 'rgba(23, 162, 184, 0.1)',
                            borderRadius: '12px',
                            border: '2px dashed rgba(23, 162, 184, 0.3)'
                          }}
                        >
                          <span style={{ fontSize: '2rem' }}>🤝</span>
                        </div>
                      )}
                      
                      <div className="flex-grow-1">
                        <h5 className="fw-bold text-light mb-1" style={{ fontSize: '1.1rem' }}>
                          {c.name}
                        </h5>
                        {c.organization && (
                          <p className="text-white-50 small mb-0">{c.organization}</p>
                        )}
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="mb-3">
                      <div className="d-flex flex-wrap gap-2">
                        <span className="badge bg-info text-dark">
                          {c.type || 'other'}
                        </span>
                        {c.country && (
                          <span className="badge bg-dark text-info">
                            🌍 {c.country}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {c.description && (
                      <p 
                        className="text-white-80 small mb-3"
                        style={{ 
                          lineHeight: '1.6',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {c.description}
                      </p>
                    )}

                    {/* Link */}
                    {c.link && (
                      <motion.a
                        href={c.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-info text-decoration-none small d-block mb-3"
                        whileHover={{ x: 5 }}
                      >
                        🔗 {c.link.replace(/^https?:\/\//, '').substring(0, 30)}...
                      </motion.a>
                    )}

                    {/* Actions */}
                    <div className="d-flex gap-2 mt-auto pt-3 border-top border-secondary">
                      <motion.div
                        className="flex-grow-1"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Link 
                          to={`/admin/kolaborasi/${c.id}/edit`} 
                          className="btn btn-sm btn-outline-info w-100"
                          style={{ borderRadius: '8px' }}
                        >
                          ✏️ Edit
                        </Link>
                      </motion.div>
                      <motion.button 
                        onClick={() => onDelete(c.id)} 
                        className="btn btn-sm btn-outline-danger"
                        style={{ borderRadius: '8px' }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        🗑️
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}

            {items.length === 0 && (
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
                  <div style={{ fontSize: '4rem' }}>🤝</div>
                  <h5 className="text-white-50 mt-3">
                    {q ? `Tidak ada hasil untuk "${q}"` : 'Belum ada kolaborasi'}
                  </h5>
                  {!q && (
                    <motion.div
                      className="mt-3"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link to="/admin/kolaborasi/new" className="btn btn-info">
                        + Tambah Kolaborasi Pertama
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.nav 
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ul className="pagination justify-content-center">
              <motion.li 
                className={`page-item ${page<=1?'disabled':''}`}
                whileHover={page > 1 ? { scale: 1.05 } : {}}
              >
                <button 
                  className="page-link bg-dark text-info border-secondary" 
                  onClick={() => setPage(p => Math.max(1, p-1))}
                  style={{ borderRadius: '8px 0 0 8px' }}
                >
                  ← Prev
                </button>
              </motion.li>
              
              {[...Array(totalPages)].map((_,i)=>(
                <motion.li 
                  key={i} 
                  className={`page-item ${page===i+1?'active':''}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button 
                    className={`page-link ${page===i+1 ? 'bg-info text-dark border-info' : 'bg-dark text-light border-secondary'}`}
                    onClick={()=>setPage(i+1)}
                  >
                    {i+1}
                  </button>
                </motion.li>
              ))}
              
              <motion.li 
                className={`page-item ${page>=totalPages?'disabled':''}`}
                whileHover={page < totalPages ? { scale: 1.05 } : {}}
              >
                <button 
                  className="page-link bg-dark text-info border-secondary" 
                  onClick={() => setPage(p => Math.min(totalPages, p+1))}
                  style={{ borderRadius: '0 8px 8px 0' }}
                >
                  Next →
                </button>
              </motion.li>
            </ul>
          </motion.nav>
        )}
      </section>
    </AdminGate>
  );
}
