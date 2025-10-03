// src/pages/AnggotaDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMemberDetailBySlug } from "../lib/apiMembers";

export default function AnggotaDetail() {
  const { slug } = useParams();
  const [member, setMember] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const m = await getMemberDetailBySlug(slug);
        setMember(m);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <section className="section section-dark text-center"><p>Loading…</p></section>;
  if (err) return <section className="section section-dark text-center"><p className="text-danger">{err}</p></section>;
  if (!member) return <section className="section section-dark text-center"><p>Tidak ditemukan.</p></section>;

  return (
    <section className="section section-dark pb-5">{/* ruang aman dari footer */}
      <div className="container">
        {/* ====== HEADER: 2 kolom ====== */}
        <div className="row g-4 align-items-start mb-4">
          {/* LEFT */}
          <div className="col-lg-4">
            <div className="card card-dark p-4 h-100">
              <div className="text-center">
                <img
                  src={member.avatar_url}
                  alt={member.name}
                  className="rounded-circle mb-3"
                  style={{ width: 150, height: 150, objectFit: "cover" }}
                />
                <h4 className="text-light mb-1">{member.name}</h4>
                {member.title && <div className="text-white-80">{member.title}</div>}
                {member.position && <div className="text-info mt-1">{member.position}</div>}
                {member.email && (
                  <div className="mt-2">
                    <a href={`mailto:${member.email}`} className="btn btn-sm btn-outline-info">{member.email}</a>
                  </div>
                )}
              </div>

              {/* tags spesialis */}
              <hr className="border-secondary my-4" />
              <div className="d-flex flex-wrap gap-2">
                {(member.member_specialists || [])
                  .map((ms) => ms.spec?.name)
                  .filter(Boolean)
                  .map((s) => (
                    <span key={s} className="badge rounded-pill bg-primary">{s}</span>
                  ))}
              </div>

              {/* skills & certs (opsional tampilan ringkas) */}
              {member.skills?.length ? (
                <>
                  <h6 className="mt-4 text-white-80">Bidang Keahlian</h6>
                  <ul className="mb-0">
                    {member.skills.map((s, i) => <li key={i}>{s.skill_name}</li>)}
                  </ul>
                </>
              ) : null}

              {member.certifications?.length ? (
                <>
                  <h6 className="mt-3 text-white-80">Certifications</h6>
                  <ul className="mb-0">
                    {member.certifications.map((c, i) => <li key={i}>{c.cert_name}</li>)}
                  </ul>
                </>
              ) : null}
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-lg-8">
            <div className="card card-dark p-4 h-100">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="text-light mb-0">Tentang</h5>
                {/* contoh tombol atau apa pun */}
                {/* <Link className="btn btn-sm btn-outline-light">Action</Link> */}
              </div>
              <p className="text-white-80 mb-0">{member.bio || "—"}</p>
            </div>
          </div>
        </div>

        {/* ====== SECTION BAWAH: full width ====== */}
        {member.experiences?.length ? (
          <div className="card card-dark p-4 mb-4">
            <h5 className="text-light mb-3">Pengalaman</h5>
            <ul className="list-unstyled mb-0">
              {member.experiences.map((ex, i) => (
                <li key={i} className="mb-3">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>{ex.role}</strong>{ex.org ? <> &nbsp;– {ex.org}</> : null}
                    </div>
                    {ex.period && <small className="text-white-80">{ex.period}</small>}
                  </div>
                  {ex.bullets?.length ? (
                    <ul className="mt-2">
                      {ex.bullets.map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {member.educations?.length ? (
          <div className="card card-dark p-4 mb-5">{/* mb-5 supaya tidak “nempel” */}
            <h5 className="text-light mb-3">Pendidikan</h5>
            <ul className="list-unstyled mb-0">
              {member.educations.map((ed, i) => (
                <li key={i} className="mb-2">
                  <strong>{ed.degree}</strong>{ed.org ? <> &nbsp;– {ed.org}</> : null}
                  {ed.year ? <> <span className="text-white-80">({ed.year})</span></> : null}
                  {ed.note ? <div className="text-white-80 small">{ed.note}</div> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <Link to="/anggota" className="btn btn-outline-light mt-2">
          &larr; Kembali ke daftar
        </Link>
      </div>
    </section>
  );
}
