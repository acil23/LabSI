import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../../lib/http";
import AdminGate from "../../components/adminGate";
import { motion, AnimatePresence } from "framer-motion";

function formatDate(iso) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")} / ${String(
    d.getMonth() + 1
  ).padStart(2, "0")} / ${d.getFullYear()}`;
}

export default function NewsAdminList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function loadNews() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/news?page=1&perPage=100`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Gagal memuat berita");
      setItems(j.data || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNews();
  }, []);

  async function handleDelete(slug) {
    if (!window.confirm("Yakin ingin menghapus berita ini?")) return;
    try {
      const res = await fetch(`${API_BASE}/admin/news/${slug}`, {
        method: "DELETE",
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Gagal menghapus berita");
      alert("✅ Berita berhasil dihapus");
      loadNews();
    } catch (e) {
      alert("❌ " + e.message);
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
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
          <p className="text-white-50 mt-3">Memuat berita...</p>
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
                <span style={{ fontSize: '1.5rem' }}>📰</span>
                Kelola Berita & Acara
              </h2>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/admin/berita/new" className="btn btn-info">
                + Tambah Berita Baru
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
                    <th style={{ width: "5%", borderColor: 'rgba(23, 162, 184, 0.2)' }}>#</th>
                    <th style={{ borderColor: 'rgba(23, 162, 184, 0.2)' }}>Judul</th>
                    <th style={{ width: "10%", borderColor: 'rgba(23, 162, 184, 0.2)' }}>Kategori</th>
                    <th style={{ width: "15%", borderColor: 'rgba(23, 162, 184, 0.2)' }}>Tanggal</th>
                    <th style={{ width: "20%", borderColor: 'rgba(23, 162, 184, 0.2)' }}>Aksi</th>
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
                        <td colSpan="5" className="text-center text-white-80 py-5">
                          <div style={{ fontSize: '3rem' }}>📭</div>
                          <p className="mt-3 mb-0">Belum ada berita</p>
                        </td>
                      </motion.tr>
                    )}
                    
                    {items.map((n, i) => (
                      <motion.tr 
                        key={n.slug}
                        variants={tableRowVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ 
                          backgroundColor: 'rgba(23, 162, 184, 0.1)',
                          transition: { duration: 0.2 }
                        }}
                        style={{ borderColor: 'rgba(23, 162, 184, 0.1)' }}
                      >
                        <td>
                          <span className="badge bg-info text-dark">{i + 1}</span>
                        </td>
                        <td>
                          <strong className="text-light d-block mb-1">{n.title}</strong>
                          <div className="small text-white-50" style={{ maxWidth: '500px' }}>
                            {n.excerpt}
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-dark text-info">
                            {n.category}
                          </span>
                        </td>
                        <td>
                          <span className="text-white-80 small">
                            📅 {formatDate(n.date)}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2 flex-wrap">
                            <motion.button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => navigate(`/admin/berita/${n.slug}/edit`)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              style={{ borderRadius: '8px' }}
                            >
                              ✏️ Edit
                            </motion.button>
                            <motion.button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(n.slug)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              style={{ borderRadius: '8px' }}
                            >
                              🗑️ Hapus
                            </motion.button>
                            <motion.a
                              href={`/berita/${n.slug}`}
                              className="btn btn-sm btn-outline-light"
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
                transition={{ delay: 0.6 }}
              >
                <p className="text-white-50 small mb-0 text-center">
                  Total: <span className="text-info fw-bold">{items.length}</span> berita
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </AdminGate>
  );
}
