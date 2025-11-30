import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getJournalBySlug } from "../../lib/api";
import AdminGate from "../../components/adminGate";
import { adminCreateJournal, adminUpdateJournal } from "../../lib/api";
import { uploadForm, asAbsolute } from "../../lib/http";
import { motion } from "framer-motion";

export default function JournalEditor() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    authors: "",
    venue: "",
    year: "",
    type: "Journal",
    doi: "",
    pdf_url: "",
    thumb_url: "",
    abstract: "",
    keywords: "",
  });

  const [loading, setLoading] = useState(false);
  const [busyUpload, setBusyUpload] = useState({ pdf: false, thumb: false });

  useEffect(() => {
    (async () => {
      if (!isEdit) return;
      try {
        setLoading(true);
        const d = await getJournalBySlug(slug);
        setForm({
          title: d.title || "",
          authors: d.authors || "",
          venue: d.venue || "",
          year: d.year || "",
          type: d.type || "Journal",
          doi: d.doi || "",
          pdf_url: d.pdf_url || "",
          thumb_url: d.thumb_url || "",
          abstract: d.abstract || "",
          keywords: Array.isArray(d.keywords_json) ? d.keywords_json.join(", ") : "",
        });
      } catch (e) {
        alert(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [isEdit, slug]);

  function update(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function onUpload(kind, file) {
    if (!file) return;
    try {
      setBusyUpload((s) => ({ ...s, [kind]: true }));
      const fd = new FormData();
      fd.append("file", file);
      const endpoint = kind === "pdf" ? "/uploads/journals/pdf" : "/uploads/journals/thumb";
      const res = await uploadForm(endpoint, fd);
      if (kind === "pdf") update("pdf_url", res.url);
      else update("thumb_url", res.url);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusyUpload((s) => ({ ...s, [kind]: false }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        title: form.title,
        authors: form.authors
          ? form.authors.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        venue: form.venue || null,
        year: form.year ? Number(form.year) : null,
        type: form.type || "Journal",
        doi: form.doi || null,
        pdf_url: form.pdf_url || null,
        thumb_url: form.thumb_url || null,
        abstract: form.abstract || null,
        keywords: form.keywords
          ? form.keywords.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      if (isEdit) {
        await adminUpdateJournal(slug, payload);
        alert("✅ Jurnal diperbarui");
      } else {
        const r = await adminCreateJournal(payload);
        alert("✅ Jurnal ditambahkan");
        navigate(`/admin/jurnal/${r.slug}/edit`, { replace: true });
        return;
      }
      navigate("/admin/jurnal");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading && isEdit) return (
    <AdminGate>
      <section className="section section-dark text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
              <Link to="/admin/jurnal" className="btn btn-warning">
                ← Kembali
              </Link>
            </motion.div>
            
            <motion.h2 
              className="text-light m-0 d-flex align-items-center gap-2"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span style={{ fontSize: '1.5rem' }}>
                {isEdit ? '✏️' : '➕'}
              </span>
              {isEdit ? "Ubah Jurnal" : "Tambah Jurnal"}
            </motion.h2>
            
            <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
              <Link to="/admin" className="btn btn-secondary">
                Home (Admin)
              </Link>
            </motion.div>
          </motion.div>

          {/* Form Card */}
          <motion.form 
            onSubmit={onSubmit} 
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
            <div className="row g-4">
              {/* Title & Year */}
              <motion.div 
                className="col-md-8"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <label className="form-label text-info fw-semibold">📝 Judul *</label>
                <motion.input
                  className="form-control bg-dark text-light border-secondary"
                  style={{ borderRadius: '10px' }}
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="Masukkan judul publikasi..."
                  required
                  whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
                />
              </motion.div>
              
              <motion.div 
                className="col-md-4"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.45 }}
              >
                <label className="form-label text-info fw-semibold">📅 Tahun</label>
                <motion.input
                  className="form-control bg-dark text-light border-secondary"
                  style={{ borderRadius: '10px' }}
                  type="number"
                  min="1900"
                  max="2100"
                  value={form.year}
                  onChange={(e) => update("year", e.target.value)}
                  placeholder="2024"
                  whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
                />
              </motion.div>

              {/* Authors & Type */}
              <motion.div 
                className="col-md-8"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 }}
              >
                <label className="form-label text-info fw-semibold">👥 Penulis (pisahkan koma)</label>
                <motion.input
                  className="form-control bg-dark text-light border-secondary"
                  style={{ borderRadius: '10px' }}
                  placeholder="Nama A, Nama B, Nama C..."
                  value={form.authors}
                  onChange={(e) => update("authors", e.target.value)}
                  whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
                />
              </motion.div>
              
              <motion.div 
                className="col-md-4"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.55 }}
              >
                <label className="form-label text-info fw-semibold">📚 Tipe</label>
                <motion.select
                  className="form-select bg-dark text-light border-secondary"
                  style={{ borderRadius: '10px' }}
                  value={form.type}
                  onChange={(e) => update("type", e.target.value)}
                  whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
                >
                  <option>Journal</option>
                  <option>Conference</option>
                  <option>Workshop</option>
                  <option>Thesis</option>
                </motion.select>
              </motion.div>

              {/* Venue & DOI */}
              <motion.div 
                className="col-md-8"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.6 }}
              >
                <label className="form-label text-info fw-semibold">📍 Venue / Publisher</label>
                <motion.input
                  className="form-control bg-dark text-light border-secondary"
                  style={{ borderRadius: '10px' }}
                  value={form.venue}
                  onChange={(e) => update("venue", e.target.value)}
                  placeholder="IEEE Transactions on..."
                  whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
                />
              </motion.div>
              
              <motion.div 
                className="col-md-4"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.65 }}
              >
                <label className="form-label text-info fw-semibold">🔗 DOI</label>
                <motion.input
                  className="form-control bg-dark text-light border-secondary"
                  style={{ borderRadius: '10px' }}
                  value={form.doi}
                  onChange={(e) => update("doi", e.target.value)}
                  placeholder="10.1234/..."
                  whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
                />
              </motion.div>

              {/* Abstract & Keywords */}
              <motion.div 
                className="col-md-8"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.7 }}
              >
                <label className="form-label text-info fw-semibold">📄 Abstrak</label>
                <motion.textarea
                  className="form-control bg-dark text-light border-secondary"
                  style={{ borderRadius: '10px' }}
                  rows={5}
                  value={form.abstract}
                  onChange={(e) => update("abstract", e.target.value)}
                  placeholder="Ringkasan penelitian..."
                  whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
                />
              </motion.div>
              
              <motion.div 
                className="col-md-4"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.75 }}
              >
                <label className="form-label text-info fw-semibold">🏷️ Kata kunci (koma)</label>
                <motion.input
                  className="form-control bg-dark text-light border-secondary"
                  style={{ borderRadius: '10px' }}
                  value={form.keywords}
                  onChange={(e) => update("keywords", e.target.value)}
                  placeholder="AI, ML, Deep Learning"
                  whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
                />
              </motion.div>

              {/* PDF Upload */}
              <motion.div 
                className="col-md-6"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.8 }}
              >
                <label className="form-label text-info fw-semibold">📑 PDF Upload</label>
                <div className="d-flex gap-2">
                  <motion.input 
                    className="form-control bg-dark text-light border-secondary" 
                    style={{ borderRadius: '10px' }}
                    value={form.pdf_url} 
                    onChange={(e) => update("pdf_url", e.target.value)}
                    placeholder="URL akan muncul setelah upload"
                    whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
                  />
                  <label className="btn btn-outline-info mb-0" style={{ borderRadius: '10px', whiteSpace: 'nowrap' }}>
                    {busyUpload.pdf ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" />
                        Uploading...
                      </>
                    ) : (
                      '⬆️ Upload'
                    )}
                    <input
                      type="file"
                      accept="application/pdf"
                      hidden
                      onChange={(e) => onUpload("pdf", e.target.files?.[0])}
                    />
                  </label>
                </div>
                {form.pdf_url && (
                  <motion.div 
                    className="mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <a className="text-info small" href={asAbsolute(form.pdf_url)} target="_blank" rel="noreferrer">
                      📄 Preview PDF →
                    </a>
                  </motion.div>
                )}
              </motion.div>

              {/* Thumbnail Upload */}
              <motion.div 
                className="col-md-6"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.85 }}
              >
                <label className="form-label text-info fw-semibold">🖼️ Thumbnail Upload</label>
                <div className="d-flex gap-2">
                  <motion.input 
                    className="form-control bg-dark text-light border-secondary" 
                    style={{ borderRadius: '10px' }}
                    value={form.thumb_url} 
                    onChange={(e) => update("thumb_url", e.target.value)}
                    placeholder="URL akan muncul setelah upload"
                    whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
                  />
                  <label className="btn btn-outline-info mb-0" style={{ borderRadius: '10px', whiteSpace: 'nowrap' }}>
                    {busyUpload.thumb ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" />
                        Uploading...
                      </>
                    ) : (
                      '⬆️ Upload'
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => onUpload("thumb", e.target.files?.[0])}
                    />
                  </label>
                </div>
                {form.thumb_url && (
                  <motion.div 
                    className="mt-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <motion.img
                      src={asAbsolute(form.thumb_url)}
                      alt="thumb"
                      style={{
                        height: 100, 
                        borderRadius: 8, 
                        objectFit: "cover",
                        border: '2px solid rgba(23, 162, 184, 0.3)'
                      }}
                      whileHover={{ scale: 1.05 }}
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
                disabled={loading} 
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
                    💾 {isEdit ? "Simpan Perubahan" : "Simpan"}
                  </>
                )}
              </motion.button>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/admin/jurnal" 
                  className="btn btn-outline-light px-4 py-2"
                  style={{ borderRadius: '10px' }}
                >
                  ❌ Batal
                </Link>
              </motion.div>
            </motion.div>
          </motion.form>
        </div>
      </section>
    </AdminGate>
  );
}
