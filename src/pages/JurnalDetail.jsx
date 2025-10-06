import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJournalBySlug, listJournals } from "../lib/apiJournals";

export default function JurnalDetail() {
  const { slug } = useParams();
  const [j, setJ] = useState(null);
  const [others, setOthers] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getJournalBySlug(slug);
        setJ(data);
        const { data: more } = await listJournals({ perPage: 5 });
        setOthers(more.filter((x) => x.slug !== slug).slice(0, 4));
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <section className="section section-dark text-center"><p>Loading…</p></section>;
  if (err) return <section className="section section-dark text-center"><p className="text-danger">{err}</p></section>;
  if (!j) return <section className="section section-dark text-center"><p>Tidak ditemukan.</p></section>;

  return (
    <section className="section section-dark pb-5">
      <div className="container">
        <div className="card card-dark p-4 mb-4">
          <h3 className="text-light mb-3">{j.title}</h3>

          <div className="mb-2">
            <div className="text-white-80">
              <strong>Penulis: </strong>
              {(j.authors || []).join(", ") || "—"}
            </div>
            {j.affiliations?.length ? (
              <div className="small text-white-50">
                <strong>Afliasi:</strong> {(j.affiliations || []).join("; ")}
              </div>
            ) : null}
            {j.publisher && (
              <div className="small text-white-50">
                <strong>Publisher: </strong>{j.publisher} {j.year ? `(${j.year})` : ""}
              </div>
            )}
          </div>

          {j.abstract && (
            <>
              <h5 className="text-light mt-3">Abstrak</h5>
              <p className="text-white-80">{j.abstract}</p>
            </>
          )}

          {j.keywords?.length ? (
            <div className="mb-3">
              <strong className="text-white-80">Kata Kunci: </strong>
              {(j.keywords || []).map((k) => (
                <span key={k} className="badge rounded-pill bg-primary me-1">{k}</span>
              ))}
            </div>
          ) : null}

          {(j.sections || []).map((s, i) => (
            <div key={i} className="mt-4">
              {s.heading && <h5 className="text-light">{s.heading}</h5>}
              {s.body && <p className="text-white-80" style={{ whiteSpace: 'pre-line' }}>{s.body}</p>}
            </div>
          ))}

          {j.references?.length ? (
            <>
              <h5 className="text-light mt-4">Daftar Pustaka</h5>
              <ol className="text-white-80">
                {j.references.map((r, i) => <li key={i}>{r}</li>)}
              </ol>
            </>
          ) : null}

          <div className="mt-3 d-flex gap-2">
            <Link to="/jurnal" className="btn btn-outline-light">← Kembali</Link>
            {j.pdfUrl && (
              <a className="btn btn-primary" href={j.pdfUrl} target="_blank" rel="noreferrer">
                ⬇️ Download PDF
              </a>
            )}
          </div>
        </div>

        {/* Jurnal lain */}
        {others.length ? (
          <div className="card card-dark p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="text-light mb-0">Jurnal Lainnya…</h6>
              <Link to="/jurnal" className="text-info text-decoration-none">Lihat semua</Link>
            </div>
            <ul className="list-unstyled mb-0">
              {others.map((o) => (
                <li key={o.slug} className="mb-2">
                  <Link to={`/jurnal/${o.slug}`} className="text-info text-decoration-none">
                    {o.title}
                  </Link>
                  <div className="small text-white-50">
                    {(o.authors || []).join(", ")}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
