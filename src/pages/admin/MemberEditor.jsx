import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminGate from "../../components/adminGate";
import {
  getMemberDetailBySlug,
  createMember,
  updateMember,
} from "../../lib/apiMembers";
import { Link } from "react-router-dom";
import { API_BASE, asAbsolute } from "../../lib/http";
import { uploadWithProgress } from "../../lib/uploadProgress";
import { motion } from "framer-motion";

const toCSV = (arr) => (arr || []).join(", ");
const fromCSV = (s) =>
  (s || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

function RowActions({ text = "+ Tambah", onAdd }) {
  return (
    <motion.button 
      type="button" 
      className="btn btn-sm btn-outline-light" 
      onClick={onAdd}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ borderRadius: '8px' }}
    >
      {text}
    </motion.button>
  );
}

export default function MemberEditor() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);
  const nav = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    slug: "",
    name: "",
    title: "",
    position: "Anggota",
    faculty: "",
    program: "",
    email: "",
    avatar_url: "",
    bio: "",
    specialistsCSV: "",
    skillsCSV: "",
    certificationsCSV: "",
    experiences: [],
    educations: [],
    socials: [],
  });

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [localPreview, setLocalPreview] = useState("");

  function updateField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function onPickFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);
    setLocalPreview(tempUrl);
    setUploading(true);
    setProgress(0);

    try {
      const data = await uploadWithProgress({
        url: `${API_BASE}/uploads/avatar`,
        file,
        fields: { slug: form.slug || "member" },
        onProgress: setProgress,
      });
      updateField("avatar_url", data.url);
    } catch (err) {
      alert(err.message || "Upload gagal");
    } finally {
      setUploading(false);
      setTimeout(() => URL.revokeObjectURL(tempUrl), 1000);
      e.target.value = "";
      setLocalPreview("");
    }
  }

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        setLoading(true);
        const m = await getMemberDetailBySlug(slug);
        setForm((f) => ({
          ...f,
          slug: m.slug,
          name: m.name,
          title: m.title || "",
          position: m.position || "Anggota",
          faculty: m.faculty || "",
          program: m.program || "",
          email: m.email || "",
          avatar_url: m.avatar_url || "",
          bio: m.bio || "",
          specialistsCSV: toCSV((m.member_specialists || []).map((ms) => ms.spec?.name).filter(Boolean)),
          skillsCSV: toCSV((m.skills || []).map((s) => s.skill_name)),
          certificationsCSV: toCSV((m.certifications || []).map((c) => c.cert_name)),
          experiences: m.experiences || [],
          educations: m.educations || [],
          socials: m.socials || [],
        }));
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, isEdit]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        slug: form.slug,
        name: form.name,
        title: form.title || null,
        position: form.position || "Anggota",
        faculty: form.faculty || null,
        program: form.program || null,
        email: form.email || null,
        avatar_url: form.avatar_url || null,
        bio: form.bio || null,
        specialists: fromCSV(form.specialistsCSV),
        skills: fromCSV(form.skillsCSV),
        certifications: fromCSV(form.certificationsCSV),
        experiences: form.experiences,
        educations: form.educations,
        socials: form.socials,
      };
      if (isEdit) await updateMember(slug, payload);
      else await createMember(payload);
      nav("/admin/anggota");
    } catch (e) {
      setErr(e.message);
    }
  }

  const addExp = () => updateField("experiences", [...form.experiences, { role: "", org: "", period: "", bullets: [] }]);
  const addEdu = () => updateField("educations", [...form.educations, { degree: "", org: "", year: "", note: "" }]);
  const addSoc = () => updateField("socials", [...form.socials, { type: "linkedin", url: "" }]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) return (
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
          <p className="text-white-50 mt-3">Memuat data anggota...</p>
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
            <Link to="/admin/anggota" className="btn btn-warning">
              ← Kembali
            </Link>
          </motion.div>
          
          <motion.h2 
            className="section-title mb-0 d-flex align-items-center gap-2"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span style={{ fontSize: '1.5rem' }}>
              {isEdit ? '✏️' : '➕'}
            </span>
            {isEdit ? "Edit" : "Tambah"} Anggota
          </motion.h2>
          
          <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
            <Link to="/admin" className="btn btn-secondary">
              Home (Admin)
            </Link>
          </motion.div>
        </motion.div>

        {err && (
          <motion.p 
            className="alert alert-danger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {err}
          </motion.p>
        )}

        {/* Form */}
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
          {/* Basic Info Section */}
          <div className="row g-4">
            {!isEdit && (
              <motion.div 
                className="col-md-4"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <label className="form-label text-info fw-semibold">🔑 Slug (unik) *</label>
                <motion.input
                  className="form-control bg-dark text-light border-secondary"
                  style={{ borderRadius: '10px' }}
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="nama-anggota"
                  required
                  whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
                />
              </motion.div>
            )}
            
            <motion.div 
              className="col-md-8"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.45 }}
            >
              <label className="form-label text-info fw-semibold">👤 Nama *</label>
              <motion.input
                className="form-control bg-dark text-light border-secondary"
                style={{ borderRadius: '10px' }}
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Nama lengkap"
                required
                whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
              />
            </motion.div>

            <motion.div 
              className="col-md-4"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
            >
              <label className="form-label text-info fw-semibold">🎓 Gelar</label>
              <motion.input
                className="form-control bg-dark text-light border-secondary"
                style={{ borderRadius: '10px' }}
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="S.Kom., M.T."
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
              <label className="form-label text-info fw-semibold">💼 Jabatan</label>
              <motion.input
                className="form-control bg-dark text-light border-secondary"
                style={{ borderRadius: '10px' }}
                value={form.position}
                onChange={(e) => updateField("position", e.target.value)}
                placeholder="Dosen / Mahasiswa / Anggota"
                whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
              />
            </motion.div>

            <motion.div 
              className="col-md-4"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
            >
              <label className="form-label text-info fw-semibold">✉️ Email</label>
              <motion.input
                type="email"
                className="form-control bg-dark text-light border-secondary"
                style={{ borderRadius: '10px' }}
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="email@example.com"
                whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
              />
            </motion.div>

            <motion.div 
              className="col-md-6"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.65 }}
            >
              <label className="form-label text-info fw-semibold">🏛️ Fakultas</label>
              <motion.input
                className="form-control bg-dark text-light border-secondary"
                style={{ borderRadius: '10px' }}
                value={form.faculty}
                onChange={(e) => updateField("faculty", e.target.value)}
                placeholder="FILKOM"
                whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
              />
            </motion.div>

            <motion.div 
              className="col-md-6"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 }}
            >
              <label className="form-label text-info fw-semibold">📚 Prodi</label>
              <motion.input
                className="form-control bg-dark text-light border-secondary"
                style={{ borderRadius: '10px' }}
                value={form.program}
                onChange={(e) => updateField("program", e.target.value)}
                placeholder="Teknik Informatika"
                whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
              />
            </motion.div>

            {/* Avatar Upload */}
            <motion.div 
              className="col-md-6"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.75 }}
            >
              <label className="form-label text-info fw-semibold">🖼️ Avatar URL</label>
              <div className="d-flex gap-2">
                <motion.input
                  className="form-control bg-dark text-light border-secondary"
                  style={{ borderRadius: '10px' }}
                  value={form.avatar_url}
                  onChange={(e) => updateField("avatar_url", e.target.value)}
                  placeholder="https://..."
                  disabled={uploading}
                  whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
                />
                <label className="btn btn-outline-light mb-0" style={{ borderRadius: '10px', whiteSpace: 'nowrap' }}>
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      {progress}%
                    </>
                  ) : "⬆️ Upload"}
                  <input type="file" accept="image/*" onChange={onPickFile} hidden />
                </label>
              </div>

              {uploading && (
                <div className="progress mt-2" style={{height: 6}}>
                  <div className="progress-bar bg-info" role="progressbar" style={{width: `${progress}%`}} />
                </div>
              )}

              {(localPreview || form.avatar_url) && (
                <motion.div 
                  className="mt-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <motion.img
                    alt="preview"
                    src={localPreview || asAbsolute(form.avatar_url)}
                    style={{ 
                      width:120, 
                      height:120, 
                      objectFit:"cover", 
                      borderRadius:"50%",
                      border: '3px solid rgba(23, 162, 184, 0.5)'
                    }}
                    onError={(e)=>{ e.currentTarget.style.display='none'; }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  />
                </motion.div>
              )}
            </motion.div>

            {/* CSV Fields */}
            <motion.div 
              className="col-md-6"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.8 }}
            >
              <label className="form-label text-info fw-semibold">🎯 Spesialis (koma)</label>
              <motion.input
                className="form-control bg-dark text-light border-secondary"
                style={{ borderRadius: '10px' }}
                value={form.specialistsCSV}
                onChange={(e) => updateField("specialistsCSV", e.target.value)}
                placeholder="Data Mining, AI, IoT"
                whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
              />
            </motion.div>

            <motion.div 
              className="col-md-6"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.85 }}
            >
              <label className="form-label text-info fw-semibold">💻 Skills (koma)</label>
              <motion.input
                className="form-control bg-dark text-light border-secondary"
                style={{ borderRadius: '10px' }}
                value={form.skillsCSV}
                onChange={(e) => updateField("skillsCSV", e.target.value)}
                placeholder="React, Node, TensorFlow"
                whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
              />
            </motion.div>

            <motion.div 
              className="col-md-6"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.9 }}
            >
              <label className="form-label text-info fw-semibold">🏆 Certifications (koma)</label>
              <motion.input
                className="form-control bg-dark text-light border-secondary"
                style={{ borderRadius: '10px' }}
                value={form.certificationsCSV}
                onChange={(e) => updateField("certificationsCSV", e.target.value)}
                placeholder="AWS, TF Developer"
                whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
              />
            </motion.div>

            {/* Bio */}
            <motion.div 
              className="col-12"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.95 }}
            >
              <label className="form-label text-info fw-semibold">📝 Bio</label>
              <motion.textarea
                rows={4}
                className="form-control bg-dark text-light border-secondary"
                style={{ borderRadius: '10px' }}
                value={form.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                placeholder="Ceritakan tentang diri Anda..."
                whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
              />
            </motion.div>
          </div>

          {/* Experiences */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <hr className="my-4 border-secondary" />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-info mb-0 d-flex align-items-center gap-2">
                <span>💼</span> Pengalaman
              </h5>
              <RowActions onAdd={addExp} />
            </div>
            {form.experiences.map((ex, idx) => (
              <motion.div 
                className="row g-2 align-items-end mb-3 p-3"
                key={idx}
                style={{ 
                  background: 'rgba(23, 162, 184, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(23, 162, 184, 0.2)'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="col-md-3">
                  <input
                    className="form-control bg-dark text-light border-secondary"
                    style={{ borderRadius: '8px' }}
                    placeholder="Role/Posisi"
                    value={ex.role}
                    onChange={(e) => {
                      const c = [...form.experiences];
                      c[idx] = { ...ex, role: e.target.value };
                      updateField("experiences", c);
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    className="form-control bg-dark text-light border-secondary"
                    style={{ borderRadius: '8px' }}
                    placeholder="Organisasi"
                    value={ex.org}
                    onChange={(e) => {
                      const c = [...form.experiences];
                      c[idx] = { ...ex, org: e.target.value };
                      updateField("experiences", c);
                    }}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    className="form-control bg-dark text-light border-secondary"
                    style={{ borderRadius: '8px' }}
                    placeholder="Periode"
                    value={ex.period}
                    onChange={(e) => {
                      const c = [...form.experiences];
                      c[idx] = { ...ex, period: e.target.value };
                      updateField("experiences", c);
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    className="form-control bg-dark text-light border-secondary"
                    style={{ borderRadius: '8px' }}
                    placeholder="Bullets (koma)"
                    value={(ex.bullets || []).join(", ")}
                    onChange={(e) => {
                      const c = [...form.experiences];
                      c[idx] = { ...ex, bullets: fromCSV(e.target.value) };
                      updateField("experiences", c);
                    }}
                  />
                </div>
                <div className="col-md-1 text-end">
                  <motion.button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    style={{ borderRadius: '8px' }}
                    onClick={() => {
                      const c = [...form.experiences];
                      c.splice(idx, 1);
                      updateField("experiences", c);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🗑️
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Educations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <hr className="my-4 border-secondary" />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-info mb-0 d-flex align-items-center gap-2">
                <span>🎓</span> Pendidikan
              </h5>
              <RowActions onAdd={addEdu} />
            </div>
            {form.educations.map((ed, idx) => (
              <motion.div 
                className="row g-2 align-items-end mb-3 p-3"
                key={idx}
                style={{ 
                  background: 'rgba(23, 162, 184, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(23, 162, 184, 0.2)'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="col-md-3">
                  <input
                    className="form-control bg-dark text-light border-secondary"
                    style={{ borderRadius: '8px' }}
                    placeholder="Degree/Gelar"
                    value={ed.degree}
                    onChange={(e) => {
                      const c = [...form.educations];
                      c[idx] = { ...ed, degree: e.target.value };
                      updateField("educations", c);
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    className="form-control bg-dark text-light border-secondary"
                    style={{ borderRadius: '8px' }}
                    placeholder="Universitas"
                    value={ed.org}
                    onChange={(e) => {
                      const c = [...form.educations];
                      c[idx] = { ...ed, org: e.target.value };
                      updateField("educations", c);
                    }}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    className="form-control bg-dark text-light border-secondary"
                    style={{ borderRadius: '8px' }}
                    placeholder="Tahun"
                    value={ed.year}
                    onChange={(e) => {
                      const c = [...form.educations];
                      c[idx] = { ...ed, year: e.target.value };
                      updateField("educations", c);
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    className="form-control bg-dark text-light border-secondary"
                    style={{ borderRadius: '8px' }}
                    placeholder="Catatan"
                    value={ed.note}
                    onChange={(e) => {
                      const c = [...form.educations];
                      c[idx] = { ...ed, note: e.target.value };
                      updateField("educations", c);
                    }}
                  />
                </div>
                <div className="col-md-1 text-end">
                  <motion.button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    style={{ borderRadius: '8px' }}
                    onClick={() => {
                      const c = [...form.educations];
                      c.splice(idx, 1);
                      updateField("educations", c);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🗑️
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <hr className="my-4 border-secondary" />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-info mb-0 d-flex align-items-center gap-2">
                <span>🔗</span> Socials
              </h5>
              <RowActions onAdd={addSoc} />
            </div>
            {form.socials.map((s, idx) => (
              <motion.div 
                className="row g-2 align-items-end mb-3 p-3"
                key={idx}
                style={{ 
                  background: 'rgba(23, 162, 184, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(23, 162, 184, 0.2)'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="col-md-3">
                  <select
                    className="form-select bg-dark text-light border-secondary"
                    style={{ borderRadius: '8px' }}
                    value={s.type}
                    onChange={(e) => {
                      const c = [...form.socials];
                      c[idx] = { ...s, type: e.target.value };
                      updateField("socials", c);
                    }}
                  >
                    {["twitter","linkedin","scholar","github","website","orcid","scopus","sinta"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-8">
                  <input
                    className="form-control bg-dark text-light border-secondary"
                    style={{ borderRadius: '8px' }}
                    placeholder="URL"
                    value={s.url}
                    onChange={(e) => {
                      const c = [...form.socials];
                      c[idx] = { ...s, url: e.target.value };
                      updateField("socials", c);
                    }}
                  />
                </div>
                <div className="col-md-1 text-end">
                  <motion.button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    style={{ borderRadius: '8px' }}
                    onClick={() => {
                      const c = [...form.socials];
                      c.splice(idx, 1);
                      updateField("socials", c);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🗑️
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Submit Buttons */}
          <motion.div 
            className="mt-4 d-flex gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <motion.button 
              type="submit" 
              className="btn btn-info text-dark px-4 py-2 fw-semibold"
              style={{ borderRadius: '10px' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              💾 {isEdit ? "Simpan Perubahan" : "Tambah Anggota"}
            </motion.button>
            <motion.button
              type="button"
              className="btn btn-outline-light px-4 py-2"
              style={{ borderRadius: '10px' }}
              onClick={() => nav("/admin/anggota")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ❌ Batal
            </motion.button>
          </motion.div>
        </motion.form>
      </section>
    </AdminGate>
  );
}
