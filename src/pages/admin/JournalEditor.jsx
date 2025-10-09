import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getJournalBySlug } from "../../lib/api";
import { adminCreateJournal, adminUpdateJournal } from "../../lib/api";
import { uploadForm, asAbsolute } from "../../lib/http";

export default function JournalEditor() {
  const { slug } = useParams(); // kalau ada => edit mode
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
        alert("Jurnal diperbarui");
      } else {
        const r = await adminCreateJournal(payload);
        alert("Jurnal ditambahkan");
        // pindah ke edit halaman baru
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

  return (
    <section className="section section-dark">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-light m-0">{isEdit ? "Ubah Jurnal" : "Tambah Jurnal"}</h2>
          <Link to="/admin/jurnal" className="btn btn-outline-light btn-sm">← Kembali</Link>
        </div>

        <form onSubmit={onSubmit} className="card card-dark p-3">
          <div className="row g-3">
            <div className="col-md-8">
              <label className="form-label text-white-80">Judul</label>
              <input
                className="form-control"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label text-white-80">Tahun</label>
              <input
                className="form-control"
                type="number"
                min="1900"
                max="2100"
                value={form.year}
                onChange={(e) => update("year", e.target.value)}
              />
            </div>

            <div className="col-md-8">
              <label className="form-label text-white-80">Penulis (pisahkan koma)</label>
              <input
                className="form-control"
                placeholder="Nama A, Nama B, ..."
                value={form.authors}
                onChange={(e) => update("authors", e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label text-white-80">Tipe</label>
              <select
                className="form-select"
                value={form.type}
                onChange={(e) => update("type", e.target.value)}
              >
                <option>Journal</option>
                <option>Conference</option>
                <option>Workshop</option>
                <option>Thesis</option>
              </select>
            </div>

            <div className="col-md-8">
              <label className="form-label text-white-80">Venue / Publisher</label>
              <input
                className="form-control"
                value={form.venue}
                onChange={(e) => update("venue", e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label text-white-80">DOI</label>
              <input
                className="form-control"
                value={form.doi}
                onChange={(e) => update("doi", e.target.value)}
              />
            </div>

            <div className="col-md-8">
              <label className="form-label text-white-80">Abstrak</label>
              <textarea
                className="form-control"
                rows={5}
                value={form.abstract}
                onChange={(e) => update("abstract", e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label text-white-80">Kata kunci (koma)</label>
              <input
                className="form-control"
                value={form.keywords}
                onChange={(e) => update("keywords", e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label text-white-80">PDF URL (otomatis setelah upload)</label>
              <div className="d-flex gap-2">
                <input className="form-control" value={form.pdf_url} onChange={(e) => update("pdf_url", e.target.value)} />
                <label className="btn btn-outline-info mb-0">
                  {busyUpload.pdf ? "Uploading…" : "Upload PDF"}
                  <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={(e) => onUpload("pdf", e.target.files?.[0])}
                  />
                </label>
              </div>
              {form.pdf_url && (
                <div className="mt-2">
                  <a className="text-info" href={asAbsolute(form.pdf_url)} target="_blank" rel="noreferrer">Preview PDF</a>
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label text-white-80">Thumbnail URL (otomatis setelah upload)</label>
              <div className="d-flex gap-2">
                <input className="form-control" value={form.thumb_url} onChange={(e) => update("thumb_url", e.target.value)} />
                <label className="btn btn-outline-info mb-0">
                  {busyUpload.thumb ? "Uploading…" : "Upload Gambar"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => onUpload("thumb", e.target.files?.[0])}
                  />
                </label>
              </div>
              {form.thumb_url && (
                <div className="mt-2">
                  <img
                    src={asAbsolute(form.thumb_url)}
                    alt="thumb"
                    style={{height: 90, borderRadius: 8, objectFit: "cover"}}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 d-flex gap-2">
            <button disabled={loading} className="btn btn-info">
              {isEdit ? "Simpan Perubahan" : "Simpan"}
            </button>
            <Link to="/admin/jurnal" className="btn btn-outline-light">Batal</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
