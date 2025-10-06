import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listJournals } from "../lib/apiJournals";

const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function JurnalIndex() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [sp, setSp] = useSearchParams();
  const page = Number(sp.get("page") || 1);
  const q = sp.get("q") || "";
  const letter = sp.get("letter") || "";

  const perPage = 8;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await listJournals({ q, letter, page, perPage });
        setItems(res);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [q, letter, page]);

  const totalPages = items.totalPages || 1;

  const go = (p) => {
    const next = Math.min(Math.max(1, p), totalPages);
    const params = {};
    if (q) params.q = q;
    if (letter) params.letter = letter;
    if (next !== 1) params.page = String(next);
    setSp(params);
  };

  const activeLetter = useMemo(() => letter.toUpperCase(), [letter]);

  return (
    <section className="section section-dark">
      <div className="container">
        <h2 className="section-title mb-3">Direktori Jurnal</h2>
        <p className="text-white-80 mb-4">
          Direktori jurnal elektronik Laboratorium Sistem Cerdas.
        </p>

        {/* Toolbar */}
        <div className="card card-dark p-3 mb-3">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <div className="flex-grow-1">
              <input
                className="form-control bg-dark text-light border-secondary"
                placeholder="Cari judul atau penulis…"
                value={q}
                onChange={(e) => setSp({ q: e.target.value, letter, page: 1 })}
              />
            </div>
            <button
              className="btn btn-outline-light"
              onClick={() => setSp({})}
              title="Reset filter"
            >
              Reset
            </button>
          </div>

          {/* Alphabet filter */}
          <div className="mt-3 d-flex flex-wrap gap-2">
            <button
              className={`btn btn-sm ${!activeLetter ? "btn-primary" : "btn-outline-light"}`}
              onClick={() => setSp({ q, page: 1 })}
            >
              Semua
            </button>
            {ABC.map((ch) => (
              <button
                key={ch}
                className={`btn btn-sm ${activeLetter === ch ? "btn-primary" : "btn-outline-light"}`}
                onClick={() => setSp({ q, letter: ch, page: 1 })}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {err && <p className="text-danger">{err}</p>}
        {loading ? (
          <p>Loading…</p>
        ) : (
          <>
            {(items.data || []).map((j) => (
              <div key={j.slug} className="card card-dark p-3 mb-3">
                <h5 className="text-light mb-1">
                  <Link className="text-decoration-none text-info" to={`/jurnal/${j.slug}`}>
                    {j.title}
                  </Link>
                </h5>
                <div className="small text-white-80">
                  <span>Penulis: </span>
                  {(j.authors || []).join(", ") || "—"}
                </div>
                {j.publisher && (
                  <div className="small text-white-50">
                    Publisher: {j.publisher} {j.year ? `(${j.year})` : ""}
                  </div>
                )}
                <div className="mt-2 d-flex gap-2">
                  <Link to={`/jurnal/${j.slug}`} className="btn btn-sm btn-outline-info">
                    Baca Detail
                  </Link>
                  {j.pdfUrl && (
                    <a
                      className="btn btn-sm btn-outline-light"
                      href={j.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      ⬇️ Download PDF
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav aria-label="Page nav" className="mt-3">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => go(page - 1)}>Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                      <button className="page-link" onClick={() => go(p)}>{p}</button>
                    </li>
                  ))}
                  <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => go(page + 1)}>Next</button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </section>
  );
}
