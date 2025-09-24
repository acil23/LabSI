import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminGate from "../../components/adminGate";
import {
  getMemberDetailBySlug,
  createMember,
  updateMember,
} from "../../lib/apiMembers";

const toCSV = (arr) => (arr || []).join(", ");
const fromCSV = (s) =>
  (s || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

function RowActions({ text = "+ Tambah", onAdd }) {
  return (
    <button
      type="button"
      className="btn btn-sm btn-outline-light"
      onClick={onAdd}
    >
      {text}
    </button>
  );
}

export default function MemberEditor() {
  const { slug } = useParams(); // undefined kalau create
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
          specialistsCSV: toCSV(
            (m.member_specialists || [])
              .map((ms) => ms.spec?.name)
              .filter(Boolean)
          ),
          skillsCSV: toCSV((m.skills || []).map((s) => s.skill_name)),
          certificationsCSV: toCSV(
            (m.certifications || []).map((c) => c.cert_name)
          ),
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

  function updateField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

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
      if (isEdit) {
        // slug di URL sebagai target
        await updateMember(slug, payload);
      } else {
        await createMember(payload);
      }
      nav("/admin/anggota");
    } catch (e) {
      setErr(e.message);
    }
  }

  const addExp = () =>
    updateField("experiences", [
      ...form.experiences,
      { role: "", org: "", period: "", bullets: [] },
    ]);
  const addEdu = () =>
    updateField("educations", [
      ...form.educations,
      { degree: "", org: "", year: "", note: "" },
    ]);
  const addSoc = () =>
    updateField("socials", [...form.socials, { type: "linkedin", url: "" }]);

  if (loading)
    return (
      <section className="section section-dark">
        <p>Loading…</p>
      </section>
    );

  return (
    <section className="section section-dark">
      <h2 className="section-title mb-3">
        {isEdit ? "Edit" : "Tambah"} Anggota
      </h2>
      <AdminGate>
        {err && <p className="text-danger">{err}</p>}
        <form onSubmit={onSubmit} className="card card-dark p-3">
          <div className="row g-3">
            {!isEdit && (
              <div className="col-md-4">
                <label className="form-label">Slug (unik)</label>
                <input
                  className="form-control bg-dark text-light border-secondary"
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  required
                />
              </div>
            )}
            <div className="col-md-8">
              <label className="form-label">Nama</label>
              <input
                className="form-control bg-dark text-light border-secondary"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Gelar</label>
              <input
                className="form-control bg-dark text-light border-secondary"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Jabatan</label>
              <input
                className="form-control bg-dark text-light border-secondary"
                value={form.position}
                onChange={(e) => updateField("position", e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control bg-dark text-light border-secondary"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Fakultas</label>
              <input
                className="form-control bg-dark text-light border-secondary"
                value={form.faculty}
                onChange={(e) => updateField("faculty", e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Prodi</label>
              <input
                className="form-control bg-dark text-light border-secondary"
                value={form.program}
                onChange={(e) => updateField("program", e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Avatar URL</label>
              <input
                className="form-control bg-dark text-light border-secondary"
                value={form.avatar_url}
                onChange={(e) => updateField("avatar_url", e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Spesialis (koma)</label>
              <input
                className="form-control bg-dark text-light border-secondary"
                value={form.specialistsCSV}
                onChange={(e) => updateField("specialistsCSV", e.target.value)}
                placeholder="Data Mining, AI, IoT"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Skills (koma)</label>
              <input
                className="form-control bg-dark text-light border-secondary"
                value={form.skillsCSV}
                onChange={(e) => updateField("skillsCSV", e.target.value)}
                placeholder="React, Node, TensorFlow"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Certifications (koma)</label>
              <input
                className="form-control bg-dark text-light border-secondary"
                value={form.certificationsCSV}
                onChange={(e) =>
                  updateField("certificationsCSV", e.target.value)
                }
                placeholder="AWS, TF Developer"
              />
            </div>
            <div className="col-12">
              <label className="form-label">Bio</label>
              <textarea
                rows={3}
                className="form-control bg-dark text-light border-secondary"
                value={form.bio}
                onChange={(e) => updateField("bio", e.target.value)}
              />
            </div>
          </div>

          {/* Experiences */}
          <hr className="my-4 border-secondary" />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="text-light mb-0">Pengalaman</h5>
            <RowActions onAdd={addExp} />
          </div>
          {form.experiences.map((ex, idx) => (
            <div className="row g-2 align-items-end mb-2" key={idx}>
              <div className="col-md-3">
                <input
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Role"
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
                  placeholder="Org"
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
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => {
                    const c = [...form.experiences];
                    c.splice(idx, 1);
                    updateField("experiences", c);
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}

          {/* Educations */}
          <hr className="my-4 border-secondary" />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="text-light mb-0">Pendidikan</h5>
            <RowActions onAdd={addEdu} />
          </div>
          {form.educations.map((ed, idx) => (
            <div className="row g-2 align-items-end mb-2" key={idx}>
              <div className="col-md-3">
                <input
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Degree"
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
                  placeholder="Organisasi"
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
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => {
                    const c = [...form.educations];
                    c.splice(idx, 1);
                    updateField("educations", c);
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}

          {/* Socials */}
          <hr className="my-4 border-secondary" />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="text-light mb-0">Socials</h5>
            <RowActions onAdd={addSoc} />
          </div>
          {form.socials.map((s, idx) => (
            <div className="row g-2 align-items-end mb-2" key={idx}>
              <div className="col-md-3">
                <select
                  className="form-select bg-dark text-light border-secondary"
                  value={s.type}
                  onChange={(e) => {
                    const c = [...form.socials];
                    c[idx] = { ...s, type: e.target.value };
                    updateField("socials", c);
                  }}
                >
                  {[
                    "twitter",
                    "linkedin",
                    "scholar",
                    "github",
                    "website",
                    "orcid",
                    "scopus",
                    "sinta",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-8">
                <input
                  className="form-control bg-dark text-light border-secondary"
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
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => {
                    const c = [...form.socials];
                    c.splice(idx, 1);
                    updateField("socials", c);
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}

          <div className="mt-4 d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              {isEdit ? "Simpan Perubahan" : "Tambah Anggota"}
            </button>
            <button
              type="button"
              className="btn btn-outline-light"
              onClick={() => nav("/admin/anggota")}
            >
              Batal
            </button>
          </div>
        </form>
      </AdminGate>
    </section>
  );
}
