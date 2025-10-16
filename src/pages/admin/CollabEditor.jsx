import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCollaborationById,
  createCollaboration,
  updateCollaboration,
  uploadCollabLogo,
} from "../../lib/api";
import { asAbsolute } from "../../lib/http";
import AdminGate from "../../components/adminGate";

export default function CollabEditor() {
  const { id } = useParams(); // kalau ada => mode edit
  const nav = useNavigate();

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

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const up = await uploadCollabLogo(file);
      setForm((f) => ({ ...f, logo_url: up.url }));
    } catch (e) {
      alert(e.message);
    } finally {
      e.target.value = "";
    }
  };

  const onSubmit = async (e) => {
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
  };

  return (
    <AdminGate>
      <section className="section section-dark">
        <h2 className="section-title mb-3">{id ? "Edit Kolaborasi" : "Tambah Kolaborasi"}</h2>

        {loading && <p className="text-white-80">Memuat…</p>}
        {err && <p className="text-danger">{err}</p>}
        
        {!loading && (
          <form className="card card-dark p-3" onSubmit={onSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nama *</label>
                <input className="form-control bg-dark text-light"
                  value={form.name}
                  onChange={(e)=>setForm({...form, name:e.target.value})}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Organisasi</label>
                <input className="form-control bg-dark text-light"
                  value={form.organization}
                  onChange={(e)=>setForm({...form, organization:e.target.value})}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Tipe</label>
                <select className="form-select bg-dark text-light"
                  value={form.type}
                  onChange={(e)=>setForm({...form, type:e.target.value})}>
                  <option value="other">Other</option>
                  <option value="research">Research</option>
                  <option value="industry">Industry</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Negara</label>
                <input className="form-control bg-dark text-light"
                  value={form.country}
                  onChange={(e)=>setForm({...form, country:e.target.value})}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Tautan</label>
                <input className="form-control bg-dark text-light"
                  value={form.link}
                  onChange={(e)=>setForm({...form, link:e.target.value})}
                  placeholder="https://…"
                />
              </div>

              <div className="col-md-8">
                <label className="form-label">Deskripsi</label>
                <textarea className="form-control bg-dark text-light" rows={4}
                  value={form.description}
                  onChange={(e)=>setForm({...form, description:e.target.value})}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Logo</label>
                <div className="d-flex gap-2 align-items-center">
                  <input type="file" accept="image/*" className="form-control bg-dark text-light" onChange={onUpload}/>
                </div>
                {form.logo_url && (
                  <div className="mt-2">
                    <img src={asAbsolute(form.logo_url)} alt="logo" style={{height:70}} />
                    <div className="small text-white-50">{form.logo_url}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 d-flex gap-2">
              <button disabled={saving} className="btn btn-info">{saving ? "Menyimpan…" : "Simpan"}</button>
              <button type="button" onClick={()=>history.back()} className="btn btn-outline-light">Batal</button>
            </div>
          </form>
        )}
      </section>
    </AdminGate>
  );
}
