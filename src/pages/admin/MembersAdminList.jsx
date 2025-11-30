import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminGate from "../../components/adminGate";
import { listMembers, deleteMember } from "../../lib/apiMembers";
import { motion, AnimatePresence } from "framer-motion";

export default function MembersAdminList() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const { data } = await listMembers({
        page: 1,
        perPage: 50,
        filters: { q },
      });
      setItems(data || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [q]);

  async function onDelete(slug) {
    if (!window.confirm("Hapus anggota ini?")) return;
    try {
      await deleteMember(slug);
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
          <p className="text-white-50 mt-3">Memuat anggota...</p>
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
              <span style={{ fontSize: '1.5rem' }}>👥</span>
              Kelola Anggota
            </h2>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/admin/anggota/new" className="btn btn-info">
              + Tambah
            </Link>
          </motion.div>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div 
            className="p-3"
            style={{ 
              borderRadius: '16px',
              background: 'rgba(23, 162, 184, 0.05)',
              border: '1px solid rgba(23, 162, 184, 0.2)'
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: '1.2rem' }}>🔍</span>
              <motion.input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari nama anggota..."
                className="form-control bg-dark text-light border-secondary"
                style={{ borderRadius: '10px' }}
                whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
              />
            </div>
          </div>
        </motion.div>

        {err && (
          <motion.p 
            className="text-danger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {err}
          </motion.p>
        )}

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
          transition={{ delay: 0.4 }}
        >
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <motion.tr
                  className="text-info"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <th style={{ borderColor: 'rgba(23, 162, 184, 0.2)' }}>Nama</th>
                  <th style={{ borderColor: 'rgba(23, 162, 184, 0.2)' }}>Jabatan</th>
                  <th style={{ borderColor: 'rgba(23, 162, 184, 0.2)' }}>Prodi</th>
                  <th style={{ borderColor: 'rgba(23, 162, 184, 0.2)' }}>Email</th>
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
                      <td colSpan="5" className="text-center text-white-80 py-5">
                        <div style={{ fontSize: '3rem' }}>👤</div>
                        <p className="mt-3 mb-0">
                          {q ? `Tidak ada hasil untuk "${q}"` : 'Belum ada anggota'}
                        </p>
                      </td>
                    </motion.tr>
                  )}
                  
                  {items.map((m, index) => (
                    <motion.tr 
                      key={m.id}
                      variants={tableRowVariant}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ 
                        backgroundColor: 'rgba(23, 162, 184, 0.1)',
                        transition: { duration: 0.2 }
                      }}
                      style={{ borderColor: 'rgba(23, 162, 184, 0.1)' }}
                    >
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {m.avatar_url && (
                            <motion.img
                              src={m.avatar_url}
                              alt={m.name}
                              className="rounded-circle"
                              style={{ 
                                width: 40, 
                                height: 40, 
                                objectFit: 'cover',
                                border: '2px solid rgba(23, 162, 184, 0.3)'
                              }}
                              whileHover={{ scale: 1.2, rotate: 5 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                          <span className="text-light fw-semibold">{m.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-dark text-info">
                          {m.position || 'Anggota'}
                        </span>
                      </td>
                      <td>
                        <span className="text-white-80">{m.program || '-'}</span>
                      </td>
                      <td>
                        {m.email ? (
                          <motion.a 
                            href={`mailto:${m.email}`}
                            className="text-info text-decoration-none"
                            whileHover={{ x: 5 }}
                          >
                            ✉️ {m.email}
                          </motion.a>
                        ) : (
                          <span className="text-white-50">-</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Link
                              to={`/admin/anggota/${m.slug}/edit`}
                              className="btn btn-sm btn-outline-info"
                              style={{ borderRadius: '8px' }}
                            >
                              ✏️ Edit
                            </Link>
                          </motion.div>
                          <motion.button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDelete(m.slug)}
                            style={{ borderRadius: '8px' }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            🗑️ Hapus
                          </motion.button>
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
              <div className="row text-center">
                <div className="col-md-4">
                  <span className="text-white-50 small">Total Anggota</span>
                  <p className="text-info fw-bold mb-0 h5">{items.length}</p>
                </div>
                <div className="col-md-4">
                  <span className="text-white-50 small">Dosen</span>
                  <p className="text-info fw-bold mb-0 h5">
                    {items.filter(i => i.position?.toLowerCase().includes('dosen')).length}
                  </p>
                </div>
                <div className="col-md-4">
                  <span className="text-white-50 small">Mahasiswa</span>
                  <p className="text-info fw-bold mb-0 h5">
                    {items.filter(i => i.position?.toLowerCase().includes('mahasiswa') || i.position === 'Anggota').length}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>
    </AdminGate>
  );
}
