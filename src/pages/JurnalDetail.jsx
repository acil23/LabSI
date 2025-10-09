import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJournalBySlug } from "../lib/api";
import { asAbsolute } from "../lib/http";

export default function JurnalDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const d = await getJournalBySlug(slug);
        setData(d);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, [slug]);

  if (err) return <p className="text-danger text-center">{err}</p>;
  if (!data) return <p className="text-center">Loading...</p>;

  return (
    <section className="section section-dark">
      <div className="container">
        <Link to="/jurnal" className="btn btn-outline-info btn-sm mb-3">
          ← Kembali ke daftar
        </Link>

        <div className="card card-dark p-4">
          {data.thumb_url && (
            <img
              src={asAbsolute(data.thumb_url)}
              alt={data.title}
              className="img-fluid rounded mb-4"
              style={{ maxHeight: 320, objectFit: "cover" }}
            />
          )}

          <h2 className="text-light mb-2">{data.title}</h2>
          <p className="text-white-80">{data.authors}</p>
          <p className="text-info mb-2">
            {data.venue} • {data.year} ({data.type})
          </p>

          <p className="text-white-80">{data.abstract}</p>

          {data.doi && (
            <p className="mt-3">
              <strong className="text-light">DOI:</strong>{" "}
              <a href={`https://doi.org/${data.doi}`} target="_blank" rel="noreferrer" className="text-info">
                {data.doi}
              </a>
            </p>
          )}

          {data.pdf_url && (
            <a
              href={asAbsolute(data.pdf_url)}
              target="_blank"
              rel="noreferrer"
              className="btn btn-info mt-3"
            >
              📄 Buka PDF
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
