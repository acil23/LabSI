import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getNews } from "../lib/api";

function formatDate(iso) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")} / ${String(d.getMonth() + 1).padStart(2, "0")} / ${d.getFullYear()}`;
}

export default function BeritaIndex() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const perPage = 6;

  useEffect(() => {
    getNews().then(setItems).catch((e) => setErr(e.message));
  }, []);

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const paged = useMemo(() => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, page]);

  const go = (p) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setSearchParams(next === 1 ? {} : { page: String(next) });
  };

  if (err) return <p className="text-danger">{err}</p>;

  return (
    <section className="section section-dark">
      <h2 className="section-title text-center mb-4">Berita & Acara</h2>

      <div className="row">
        {paged.map((n) => (
          <div className="col-md-6 mb-4" key={n.id}>
            <div className="card shadow-sm h-100 card-dark">
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={n.image}
                    loading="lazy"
                    className="img-fluid rounded-start h-100 w-100"
                    alt={n.title}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <small className="text-tanggal d-block mb-2">{formatDate(n.date)}</small>
                    <h5 className="card-title text-light">{n.title}</h5>
                    <p className="text-white-80">{n.excerpt}</p>
                    <Link to={`/berita/${n.slug}`} className="text-info fw-bold text-decoration-none">
                      read more...
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!paged.length && <p className="text-center">Belum ada berita.</p>}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Navigasi halaman">
          <ul className="pagination justify-content-center mt-4">
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
    </section>
  );
}
