import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMemberDetailBySlug } from "../lib/apiMembers";

export default function AnggotaDetail() {
  const { slug } = useParams();
  const [m, setM] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getMemberDetailBySlug(slug);
        setM(data);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (err) return <section className="section section-dark"><p className="text-danger">{err}</p></section>;
  if (loading) return <section className="section section-dark"><p className="text-center">Loading…</p></section>;
  if (!m) return null;

  const specialists = (m.member_specialists || []).map(ms => ms.spec?.name).filter(Boolean);

  return (
    <section className="section section-dark">
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h2 className="section-title mb-0 text-start">Profil Anggota</h2>
        <Link to="/anggota" className="btn btn-outline-light btn-sm">← Kembali</Link>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card card-dark p-3 text-center">
            <div className="mx-auto mb-3" style={{ width: 220, height: 220, borderRadius: "50%", overflow: "hidden" }}>
              <img src={m.avatar_url} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <h4 className="text-light mb-1">{m.name}</h4>
            <div className="text-white-80">{m.title}</div>
            <small className="text-tanggal d-block mt-2">{m.position}</small>

            <div className="mt-3">
              {specialists.map(s => <span key={s} className="badge rounded-pill bg-primary me-1 mb-1">{s}</span>)}
            </div>

            <div className="mt-3">
              {m.email && <a href={`mailto:${m.email}`} className="text-info text-decoration-none d-block mb-1">{m.email}</a>}
              {/* socials */}
              <div className="d-flex gap-2 justify-content-center">
                {(m.socials || []).map((s, i) => (
                  <a key={i} className="btn btn-sm btn-outline-light" href={s.url} target="_blank" rel="noreferrer">
                    {s.type}
                  </a>
                ))}
              </div>
            </div>

            <hr className="border-secondary my-3" />

            <div className="text-start">
              <h6 className="text-light">Bidang Keahlian</h6>
              <ul className="mb-3">
                {(m.skills || []).map((s, i) => <li key={i}>{s.skill_name}</li>)}
              </ul>

              {(m.certifications || []).length > 0 && (
                <>
                  <h6 className="text-light">Certifications</h6>
                  <ul className="mb-0">
                    {m.certifications.map((c, i) => <li key={i}>{c.cert_name}</li>)}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card card-dark p-4 mb-4">
            <h5 className="text-light mb-2">Tentang</h5>
            <p className="mb-0">{m.bio}</p>
          </div>

          {(m.experiences || []).length > 0 && (
            <div className="card card-dark p-4 mb-4">
              <h5 className="text-light mb-3">Penelitian / Pengalaman</h5>
              {m.experiences.map((e, idx) => (
                <div key={idx} className="mb-3">
                  <div className="d-flex justify-content-between">
                    <strong className="text-light">{e.role}</strong>
                    <span className="text-white-80">{e.period}</span>
                  </div>
                  <div className="text-white-80">{e.org}</div>
                  <ul className="mt-2">
                    {(e.bullets || []).map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {(m.educations || []).length > 0 && (
            <div className="card card-dark p-4">
              <h5 className="text-light mb-3">Pendidikan</h5>
              <ul className="mb-0">
                {m.educations.map((ed, i) => (
                  <li key={i} className="mb-2">
                    <strong>{ed.degree}</strong> — {ed.org} ({ed.year}){ed.note ? ` — ${ed.note}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
