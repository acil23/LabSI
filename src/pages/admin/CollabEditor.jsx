import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCollaborationById,
  createCollaboration,
  updateCollaboration,
} from "../../lib/api";
import { asAbsolute } from "../../lib/http";
import AdminGate from "../../components/adminGate";
import { Link } from "react-router-dom";
import { uploadWithProgress } from "../../lib/uploadProgress";

export default function CollabEditor() {
  const { id } = useParams();
  const nav = useNavigate();

  // ===== State dasar form =====
  const [form, setForm] = useState({
    name: "",
    organization: "",
    type: "other",
    country: "",
    logo_url: "",
    description: "",
    link: "",
  });

  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // ===== State upload logo =====
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoProgress, setLogoProgress] = useState(0);
  const [logoLocal, setLogoLocal] = useState(""); // ⬅️ inilah yang error di punyamu

  // ===== Fetch data jika edit mode =====
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getCollaborationById(id);
        setForm({
          name: data.name || "",
          organization: data.organization || "",
          type: data.type || "other",
          country: data.country || "",
          logo_url: data.logo_url || "",
          description: data.description || "",
          link: data.link || "",
        });
        setErr("");
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ===== Upload logo dengan progress bar =====
  async function onPickLogo(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const temp = URL.createObjectURL(file);
    setLogoLocal(temp);
    setLogoUploading(true);
    setLogoProgress(0);

    try {
      const { url } = await uploadWithProgress({
        url: `/uploads/collab/logo`, // tanpa /api
        file,
        onProgress: setLogoProgress,
      });
      setForm((f) => ({ ...f, logo_url: url }));
    } catch (err) {
      alert(err.message || "Upload gagal");
    } finally {
      setLogoUploading(false);
      setTimeout(() => URL.revokeObjectURL(temp), 1000);
      e.target.value = "";
    }
  }

  // ===== Submit form =====
  async function onSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true);
      if (id) await updateCollaboration(id, form);
      else await createCollaboration(form);
      nav("/admin/kolaborasi");
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminGate>
      <section className="section section-dark">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <Link to="/admin/kolaborasi" className="btn btn-warning">Kembali</Link>
            <h2 className="section-title mb-3">
              {id ? "Edit Kolaborasi" : "Tambah Kolaborasi"}
            </h2>
            <Link to="/admin" className="btn btn-secondary">Home (Admin)</Link>
        </div>
        {loading && <p className="text-white-80">Memuat…</p>}
        {err && <p className="text-danger">{err}</p>}

        {!loading && (
          <form className="card card-dark p-3" onSubmit={onSubmit}>
            <div className="row g-2">
              <div className="col-md-6">
                <label className="form-label">Nama *</label>
                <input
                  className="form-control bg-dark text-light border-secondary"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Organisasi</label>
                <input
                  className="form-control bg-dark text-light border-secondary"
                  value={form.organization}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, organization: e.target.value }))
                  }
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Tipe</label>
                <select
                  className="form-select bg-dark text-light border-secondary"
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                >
                  <option value="research">Research</option>
                  <option value="industry">Industry</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Negara</label>
                <input
                  className="form-control bg-dark text-light border-secondary"
                  value={form.country}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, country: e.target.value }))
                  }
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Tautan</label>
                <input
                  className="form-control bg-dark text-light border-secondary"
                  value={form.link}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, link: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Logo</label>
                <br />
                <label className="btn btn-outline-light">
                  {logoUploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      {logoProgress}%
                    </>
                  ) : (
                    "Upload Logo"
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={onPickLogo}
                  />
                </label>

                {logoUploading && (
                  <div className="progress mt-2" style={{ height: 6 }}>
                    <div
                      className="progress-bar"
                      style={{ width: `${logoProgress}%` }}
                    />
                  </div>
                )}

                {(logoLocal || form.logo_url) && (
                  <img
                    src={logoLocal || asAbsolute(form.logo_url)}
                    alt="Logo preview"
                    style={{
                      maxWidth: 140,
                      borderRadius: 8,
                      display: "block",
                      marginTop: 10,
                    }}
                  />
                )}
              </div>
            </div>

            <div className="col-12 mt-3">
              <label className="form-label">Deskripsi</label>
              <textarea
                rows={4}
                className="form-control bg-dark text-light border-secondary"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>

            <div className="mt-3 d-flex gap-2">
              <button disabled={saving} className="btn btn-info">
                {saving ? "Menyimpan…" : "Simpan"}
              </button>
              <button
                type="button"
                onClick={() => history.back()}
                className="btn btn-outline-light"
              >
                Batal
              </button>
            </div>
          </form>
        )}
      </section>
    </AdminGate>
  );
}
