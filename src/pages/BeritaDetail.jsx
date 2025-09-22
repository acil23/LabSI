import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getNewsBySlug, getNews } from "../lib/api";

function formatDate(iso) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")} / ${String(d.getMonth() + 1).padStart(2, "0")} / ${d.getFullYear()}`;
}

export default function BeritaDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [others, setOthers] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getNewsBySlug(slug);
        if (!data) {
          setErr("Berita tidak ditemukan.");
          return;
        }
        setItem(data);
        const all = await getNews();
        setOthers(all.filter((n) => n.slug !== slug).slice(0, 4));
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, [slug]);

  if (err) return <section className="section section-dark"><p className="text-danger">{err}</p></section>;
  if (!item) return null;

  return (
    <section className="section section-dark">
      <div className="mb-3">
        <Link to="/berita" className="btn btn-outline-light btn-sm">← Kembali ke daftar</Link>
      </div>

      <article className="card card-dark p-3">
        <img src={item.image} alt={item.title} className="img-fluid rounded mb-3" />
        <small className="text-tanggal d-block mb-2">{formatDate(item.date)} • {item.category}</small>
        <h1 className="h3 text-light">{item.title}</h1>
        {/* Konten HTML dari JSON; aman jika konten kamu sendiri */}
        <div className="mt-3 text-light" dangerouslySetInnerHTML={{ __html: item.content }} />
      </article>

      {/* Berita lain */}
      {others.length > 0 && (
        <div className="mt-4">
          <h3 className="h5 text-light mb-3">Berita Lainnya</h3>
          <div className="row">
            {others.map((n) => (
              <div className="col-md-6 mb-3" key={n.id}>
                <div className="card card-dark p-3 h-100">
                  <small className="text-tanggal d-block">{formatDate(n.date)}</small>
                  <h4 className="h6 mt-2 text-light">{n.title}</h4>
                  <p className="mb-2 text-white-80">{n.excerpt}</p>
                  <Link to={`/berita/${n.slug}`} className="text-info fw-bold text-decoration-none">
                    read more...
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
