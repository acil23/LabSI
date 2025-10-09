import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../../lib/http";

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

  useEffect(() => {
    if (editing) {
      fetch(`${API_BASE}/news/${slug}`)
        .then((r) => r.json())
        .then((d) => setForm(d))
        .catch(() => {});
    }
  }, [slug]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const uploadImage = async () => {
    if (!file) return form.image_url;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API_BASE}/uploads/news`, {
      method: "POST",
      body: fd,
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j.error || "Upload gagal");
    return j.url;
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
      navigate("/berita");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section section-dark container">
      <h2 className="mb-4">{editing ? "Edit Berita" : "Tambah Berita Baru"}</h2>
      {err && <p className="text-danger">{err}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label text-white">Judul</label>
          <input name="title" value={form.title} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label className="form-label text-white">Excerpt</label>
          <textarea name="excerpt" rows="2" value={form.excerpt} onChange={handleChange} className="form-control" />
        </div>

        <div className="mb-3">
          <label className="form-label text-white">Konten</label>
          <textarea name="content" rows="6" value={form.content} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label className="form-label text-white">Kategori</label>
          <select name="category" value={form.category} onChange={handleChange} className="form-select">
            <option value="Berita">Berita</option>
            <option value="Acara">Acara</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label text-white">Gambar</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="form-control" />
          {form.image_url && (
            <img
              src={`${API_BASE}${form.image_url}`}
              alt="preview"
              style={{ maxWidth: 300, marginTop: 10, borderRadius: 8 }}
            />
          )}
        </div>

        <button type="submit" disabled={loading} className="btn btn-info">
          {loading ? "Menyimpan..." : "Simpan Berita"}
        </button>
      </form>
    </section>
  );
}
