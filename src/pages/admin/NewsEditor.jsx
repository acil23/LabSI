import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../../lib/http";
import AdminGate from "../../components/adminGate";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NewsEditor() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const editing = !!slug;

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Berita",
    image_url: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editing) {
      fetch(`${API_BASE}/news/${slug}`)
        .then((r) => r.json())
        .then((d) => setForm(d))
        .catch(() => {});
    }
  }, [slug, editing]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const uploadImage = async () => {
    if (!file) return form.image_url;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API_BASE}/uploads/news`, {
        method: "POST",
        body: fd,
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Upload gagal");
      return j.url;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const imageUrl = await uploadImage();

      const payload = { ...form, image_url: imageUrl };
      const url = editing
        ? `${API_BASE}/admin/news/${slug}`
        : `${API_BASE}/admin/news`;
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Gagal menyimpan berita");
      alert("✅ Berita tersimpan");
      navigate("/admin/berita");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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
              <Link to="/admin/berita" className="btn btn-warning">
                ← Kembali
              </Link>
            </motion.div>
            
            <motion.h2 
              className="mb-0 text-light d-flex align-items-center gap-2"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span style={{ fontSize: '1.5rem' }}>
                {editing ? '✏️' : '➕'}
              </span>
              {editing ? "Edit Berita" : "Tambah Berita Baru"}
            </motion.h2>
            
            <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
              <Link to="/admin" className="btn btn-secondary">
                Home (Admin)
              </Link>
            </motion.div>
          </motion.div>

          {/* Error Message */}
          {err && (
            <motion.div
              className="alert alert-danger"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ❌ {err}
            </motion.div>
          )}

          {/* Form Card */}
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
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {/* Title */}
                <motion.div 
                  className="col-12"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                >
                  <label className="form-label text-info fw-semibold">
                    📝 Judul Berita *
                  </label>
                  <motion.input 
                    name="title" 
                    value={form.title} 
                    onChange={handleChange} 
                    className="form-control bg-dark text-light border-secondary"
                    style={{ borderRadius: '10px' }}
                    placeholder="Masukkan judul berita..."
                    required
                    whileFocus={{ 
                      scale: 1.01,
                      borderColor: '#17a2b8',
                      transition: { duration: 0.2 }
                    }}
                  />
                </motion.div>

                {/* Excerpt */}
                <motion.div 
                  className="col-12"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 }}
                >
                  <label className="form-label text-info fw-semibold">
                    📄 Ringkasan (Excerpt)
                  </label>
                  <motion.textarea 
                    name="excerpt" 
                    rows="2" 
                    value={form.excerpt} 
                    onChange={handleChange} 
                    className="form-control bg-dark text-light border-secondary"
                    style={{ borderRadius: '10px' }}
                    placeholder="Ringkasan singkat berita..."
                    whileFocus={{ 
                      scale: 1.01,
                      borderColor: '#17a2b8',
                      transition: { duration: 0.2 }
                    }}
                  />
                </motion.div>

                {/* Content */}
                <motion.div 
                  className="col-12"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.6 }}
                >
                  <label className="form-label text-info fw-semibold">
                    📰 Konten Berita *
                  </label>
                  <motion.textarea 
                    name="content" 
                    rows="8" 
                    value={form.content} 
                    onChange={handleChange} 
                    className="form-control bg-dark text-light border-secondary"
                    style={{ borderRadius: '10px' }}
                    placeholder="Tulis konten berita lengkap di sini..."
                    required
                    whileFocus={{ 
                      scale: 1.01,
                      borderColor: '#17a2b8',
                      transition: { duration: 0.2 }
                    }}
                  />
                  <small className="text-white-50 mt-1 d-block">
                    💡 Tip: Gunakan HTML untuk formatting (bold, italic, dll.)
                  </small>
                </motion.div>

                {/* Category */}
                <motion.div 
                  className="col-md-6"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.7 }}
                >
                  <label className="form-label text-info fw-semibold">
                    🏷️ Kategori
                  </label>
                  <motion.select 
                    name="category" 
                    value={form.category} 
                    onChange={handleChange} 
                    className="form-select bg-dark text-light border-secondary"
                    style={{ borderRadius: '10px' }}
                    whileFocus={{ 
                      scale: 1.01,
                      borderColor: '#17a2b8',
                      transition: { duration: 0.2 }
                    }}
                  >
                    <option value="Berita">Berita</option>
                    <option value="Acara">Acara</option>
                  </motion.select>
                </motion.div>

                {/* Image Upload */}
                <motion.div 
                  className="col-md-6"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.8 }}
                >
                  <label className="form-label text-info fw-semibold">
                    🖼️ Gambar
                  </label>
                  <div className="d-flex gap-2">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setFile(e.target.files[0])} 
                      className="form-control bg-dark text-light border-secondary"
                      style={{ borderRadius: '10px' }}
                      disabled={uploading}
                    />
                    {uploading && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="spinner-border spinner-border-sm text-info" role="status">
                          <span className="visually-hidden">Uploading...</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  
                  {form.image_url && (
                    <motion.div
                      className="mt-3"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-white-50 small mb-2">Preview:</p>
                      <motion.img
                        src={`${API_BASE}${form.image_url}`}
                        alt="preview"
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: 300, 
                          borderRadius: 12,
                          border: '2px solid rgba(23, 162, 184, 0.3)'
                        }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Submit Buttons */}
              <motion.div 
                className="mt-4 d-flex gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <motion.button 
                  type="submit" 
                  disabled={loading || uploading} 
                  className="btn btn-info text-dark px-4 py-2 fw-semibold"
                  style={{ borderRadius: '10px' }}
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      💾 {editing ? 'Simpan Perubahan' : 'Simpan Berita'}
                    </>
                  )}
                </motion.button>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/admin/berita" 
                    className="btn btn-outline-light px-4 py-2"
                    style={{ borderRadius: '10px' }}
                  >
                    ❌ Batal
                  </Link>
                </motion.div>
              </motion.div>
            </form>
          </motion.div>

          {/* Tips Card */}
          <motion.div
            className="mt-4 p-4"
            style={{ 
              borderRadius: '16px',
              background: 'rgba(23, 162, 184, 0.05)',
              border: '1px dashed rgba(23, 162, 184, 0.3)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <h6 className="text-info mb-3">💡 Tips Menulis Berita:</h6>
            <ul className="text-white-80 small mb-0" style={{ lineHeight: '1.8' }}>
              <li>Gunakan judul yang menarik dan deskriptif</li>
              <li>Excerpt sebaiknya 1-2 kalimat yang merangkum isi berita</li>
              <li>Pisahkan paragraf dengan jelas untuk kemudahan membaca</li>
              <li>Upload gambar dengan resolusi yang baik (minimal 1200px lebar)</li>
              <li>Periksa kembali sebelum menyimpan</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </AdminGate>
  );
}
