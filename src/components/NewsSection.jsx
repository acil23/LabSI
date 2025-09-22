// src/components/NewsSection.jsx
import React, { useEffect, useState } from "react";
import { getNews } from "../lib/api";
import { Link } from "react-router-dom";

function formatDate(iso) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")} / ${String(d.getMonth() + 1).padStart(2, "0")} / ${d.getFullYear()}`;
}

export default function NewsSection({ mainCount = 4, listCount = 5 }) {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    getNews().then(setItems).catch((e) => setErr(e.message));
  }, []);

  if (err) return <p className="text-danger">{err}</p>;
  if (!items.length) return null;

  const mains = items.slice(0, mainCount);
  const extras = items.slice(mainCount, mainCount + listCount);

  return (
    <section className="section section-dark">
      <h2 className="section-title text-center mb-4">Berita & Acara</h2>

      {/* 4 kartu utama */}
      <div className="row">
        {mains.map((n) => (
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
      </div>

      {/* daftar ringkas */}
      {!!extras.length && (
        <div className="mt-4">
          <ul className="list-group list-group-flush news-list">
            {extras.map((n) => (
              <li key={n.id} className="list-group-item bg-transparent d-flex justify-content-between align-items-start news-item">
                <div className="me-3">
                  <small className="text-tanggal d-block">{formatDate(n.date)}</small>
                  <Link to={`/berita/${n.slug}`} className="stretched-link text-decoration-none fw-semibold text-light">
                    {n.title}
                  </Link>
                </div>
                <span className="badge rounded-pill bg-primary align-self-center">read</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* tombol ke semua berita */}
      <div className="text-center mt-4">
        <Link to="/berita" className="btn btn-outline-light">Lihat Semua Berita</Link>
      </div>
    </section>
  );
}
