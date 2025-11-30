import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getJournals } from "../../lib/api";
import AdminGate from "../../components/adminGate";
import { adminDeleteJournal } from "../../lib/api";
import { asAbsolute } from "../../lib/http";
import { motion, AnimatePresence } from "framer-motion";

export default function JournalsAdminList() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function load() {
    try {
      setLoading(true);
      const res = await getJournals({ page: 1, perPage: 200 });
      setItems(res.data || []);
      setErr("");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onDelete(slug) {
    if (!window.confirm("Hapus jurnal ini?")) return;
    try {
      await adminDeleteJournal(slug);
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const tableRowVariant = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  if (loading) return (
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
          <p className="text-white-50 mt-3">Memuat data jurnal...</p>
        </motion.div>
      </section>
    </AdminGate>
  );

  if (err) return (
    <AdminGate>
      <section className="section section-dark">
        <motion.p className="text-danger text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {err}
        </motion.p>
      </section>
    </AdminGate>
  );

  return (
    <AdminGate>
      <section className="section section-dark">
        <div className="container">
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
              <h2 className="text-light m-0 d-flex align-items-center gap-2">
                <span style={{ fontSize: '1.5rem' }}>📚</span>
                Kelola Jurnal
              </h2>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/admin/jurnal/new" className="btn btn-info">
                + Tambah Jurnal
              </Link>
            </motion.div>
          </motion.div>

          {/* Table Card */}
          <motion.div 
            className="card card-dark p-4"
            style={{ 
              borderRadius: '20px',
              border: '1px solid rgba(23, 162, 184, 0.3)',
              background: 'rgba(23, 162, 184, 0.05)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                  <motion.tr 
                    className="text-info"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <th style={{ width: 60, borderColor: 'rgba(23, 162, 184, 0.2)' }}>#</th>
                    <th style={{ width: 100, borderColor: 'rgba(23, 162, 184, 0.2)' }}>Thumb</th>
                    <th style={{ borderColor: 'rgba(23, 162, 184, 0.2)' }}>Judul</th>
                    <th style={{ width: 110, borderColor: 'rgba(23, 162, 184, 0.2)' }}>Tahun</th>
                    <th style={{ width: 140, borderColor: 'rgba(23, 162, 184, 0.2)' }}>Tipe</th>
                    <th style={{ width: 180, borderColor: 'rgba(23, 162, 184, 0.2)' }}>Aksi</th>
                  </motion.tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {items.length === 0 && (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan="6" className="text-center text-white-80 py-5">
                          <div style={{ fontSize: '3rem' }}>📚</div>
                          <p className="mt-3 mb-0">Belum ada data jurnal</p>
                        </td>
                      </motion.tr>
                    )}
                    
                    {items.map((it, idx) => (
                      <motion.tr 
                        key={it.slug}
                        variants={tableRowVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ delay: idx * 0.03 }}
                        whileHover={{ 
                          backgroundColor: 'rgba(23, 162, 184, 0.1)',
                          transition: { duration: 0.2 }
                        }}
                        style={{ borderColor: 'rgba(23, 162, 184, 0.1)' }}
                      >
                        <td>
                          <span className="badge bg-info text-dark">{idx + 1}</span>
                        </td>
                        <td>
                          {it.thumb_url ? (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <img
                                src={asAbsolute(it.thumb_url)}
                                alt={it.title}
                                style={{
                                  height: 60, 
                                  width: 90, 
                                  objectFit: "cover", 
                                  borderRadius: 8,
                                  border: '2px solid rgba(23, 162, 184, 0.3)'
                                }}
                              />
                            </motion.div>
                          ) : (
                            <div 
                              className="d-flex align-items-center justify-content-center bg-dark"
                              style={{
                                height: 60,
                                width: 90,
                                borderRadius: 8,
                                border: '2px dashed rgba(23, 162, 184, 0.3)'
                              }}
                            >
                              <span style={{ fontSize: '1.5rem' }}>📄</span>
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="text-light fw-semibold mb-1">{it.title}</div>
                          <div className="small text-white-50">{it.authors}</div>
                          {it.venue && (
                            <div className="small text-info mt-1">📍 {it.venue}</div>
                          )}
                        </td>
                        <td>
                          <span className="badge bg-dark text-info">
                            📅 {it.year}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-dark text-info">
                            {it.type}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2 flex-wrap">
                            <motion.button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => navigate(`/admin/jurnal/${it.slug}/edit`)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              style={{ borderRadius: '8px' }}
                            >
                              ✏️ Edit
                            </motion.button>
                            <motion.button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => onDelete(it.slug)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              style={{ borderRadius: '8px' }}
                            >
                              🗑️ Hapus
                            </motion.button>
                            <motion.a
                              className="btn btn-sm btn-outline-light"
                              href={`/jurnal/${it.slug}`}
                              target="_blank" 
                              rel="noreferrer"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              style={{ borderRadius: '8px' }}
                            >
                              👁️ Lihat
                            </motion.a>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Stats footer */}
            {items.length > 0 && (
              <motion.div 
                className="mt-3 pt-3 border-top border-secondary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="row text-center">
                  <div className="col-md-4">
                    <span className="text-white-50 small">Total Publikasi</span>
                    <p className="text-info fw-bold mb-0 h5">{items.length}</p>
                  </div>
                  <div className="col-md-4">
                    <span className="text-white-50 small">Journal</span>
                    <p className="text-info fw-bold mb-0 h5">
                      {items.filter(i => i.type === 'Journal').length}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <span className="text-white-50 small">Conference</span>
                    <p className="text-info fw-bold mb-0 h5">
                      {items.filter(i => i.type === 'Conference').length}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </AdminGate>
  );
}
