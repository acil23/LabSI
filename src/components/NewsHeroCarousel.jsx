import React from "react";
import { Link } from "react-router-dom";
import { asAbsolute } from "../lib/http";

/**
 * items: array of news
 *    { slug, title, date, image, excerpt }
 */
export default function NewsHeroCarousel({ items = [] }) {
  if (!items.length) return null;

  const id = "newsHeroCarousel";

  return (
    <div id={id} className="carousel slide news-hero-carousel mb-4" data-bs-ride="carousel">
      {/* Indicators */}
      <div className="carousel-indicators">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target={`#${id}`}
            data-bs-slide-to={i}
            className={i === 0 ? "active" : ""}
            aria-current={i === 0 ? "true" : "false"}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slides */}
      <div className="carousel-inner rounded-4 overflow-hidden shadow-lg">
        {items.map((n, i) => (
          <div key={n.slug} className={`carousel-item ${i === 0 ? "active" : ""}`}>
            {n.image && (
              <img
                src={asAbsolute(n.image)}
                className="d-block w-100"
                alt={n.title}
                loading="lazy"
              />
            )}
            <div className="carousel-gradient" />
            <div className="carousel-caption text-start">
              <small className="text-tanggal d-block mb-1">
                {new Date(n.date).toLocaleDateString("id-ID")}
              </small>
              <h2 className="fw-bold mb-2">{n.title}</h2>
              {n.excerpt && <p className="mb-3 d-none d-md-block">{n.excerpt}</p>}
              <Link to={`/berita/${n.slug}`} className="btn btn-info">
                Baca selengkapnya
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button className="carousel-control-prev" type="button" data-bs-target={`#${id}`} data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target={`#${id}`} data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
