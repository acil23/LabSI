import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNews } from "../lib/api";
import { getMembers } from "../lib/api";
import { asAbsolute } from "../lib/http";
import { getCollaborations } from "../lib/api";
import CollabMarquee from "../components/CollabMarquee";
import heroImage from "../../public/assets/gambar/hero-image.png";

function Home() {
  // Berita
  const [newsTop, setNewsTop] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [newsErr, setNewsErr] = useState("");
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setNewsLoading(true);
        // ambil 12 terbaru, bagi: 4 kartu + 5 list
        const res = await getNews({ page: 1, perPage: 12 });
        const arr = res.data || [];
        setNewsTop(arr.slice(0, 4));
        setNewsList(arr.slice(4, 9)); // 5 item list
        setNewsErr("");
      } catch (e) {
        setNewsErr(e.message || "Gagal memuat berita");
      } finally {
        setNewsLoading(false);
      }
    })();
  }, []);

  // Anggota
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [errMembers, setErrMembers] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getMembers({ page: 1, perPage: 6 });
        setMembers(res.data || []);
        setErrMembers("");
      } catch (e) {
        setErrMembers(e.message);
      } finally {
        setLoadingMembers(false);
      }
    })();
  }, []);

  // kolaborasi

  const [collabs, setCollabs] = useState([]);
  const [loadingCollab, setLoadingCollab] = useState(true);
  const [errCollab, setErrCollab] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getCollaborations();
        setCollabs(res.data || []);
        setErrCollab("");
      } catch (e) {
        setErrCollab(e.message);
      } finally {
        setLoadingCollab(false);
      }
    })();
  }, []);

  return (
    <div>
      {/* Hero Section - Updated with new design */}
      <section className="hero-section text-light">
        {/* Background geometric elements */}
        <div className="geometric-bg">
          <div className="circle-1"></div>
          <div className="circle-2"></div>
          <div className="circle-3"></div>
          <div className="dots-pattern"></div>
          <div className="dots-pattern-2"></div>
          <div className="curved-lines">
            <div className="curved-line-1"></div>
            <div className="curved-line-2"></div>
          </div>
        </div>

        {/* Main hero content */}
        <div className="hero-content">
          <div className="hero-card">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="hero-text">
                  <h1 className="fw-bold">
                    Exploring the Frontiers of Artificial Intelligence
                  </h1>
                  <p className="lead mt-3">
                    Our lab is a hub for pioneering research and real-world applications, where we’re dedicated to reshaping the landscape of smart technology. From transformative projects to strategic collaborations, we’re set to make a significant mark in the world of IT.
                  </p>
                  <br></br>
                  <p>Whether you're into AI, machine learning, NLP, CV, or just curious — this is where you belong.</p>
                  
                </div>
              </div>
              <div className="col-md-6">
                <div className="hero-image-container">
                  <div className="hero-image-wrapper">
                    <img
                      src={heroImage}
                      alt="Hero visual"
                      className="img-fluid"
                    />
                  </div>
                </div>
              </div>
              <div className="hero-buttons">
                    <Link to="https://www.instagram.com/is.lab.filkom/" className="btn btn-primary btn-lg">Join Us</Link>
                    <Link to="/about" className="btn btn-outline-light btn-lg">More...</Link>
                  </div>
            </div>
          </div>
        </div>
      </section>

      {/* Face of IS Lab */}
      {/* Anggota */}
      <section className="section section-dark">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-title m-0">Face Of IS Lab</h2>
          <Link to="/anggota" className="btn btn-outline-info btn-sm">
            Lihat Semua →
          </Link>
        </div>

        {loadingMembers && <p className="text-white-80">Memuat anggota...</p>}
        {errMembers && <p className="text-danger">{errMembers}</p>}

        <div className="row">
          {members.map((m) => (
            <div className="col-md-4 col-lg-3 mb-4" key={m.id}>
              <div className="card card-dark text-center h-100 p-3">
                {m.avatar_url && (
                  <img
                    src={asAbsolute(m.avatar_url)}
                    alt={m.name}
                    className="rounded-circle mx-auto mb-3"
                    style={{ width: 120, height: 120, objectFit: "cover" }}
                  />
                )}
                <h5 className="text-light">{m.name}</h5>
                <p className="text-white-80 small mb-1">{m.title}</p>
                <p className="text-info small">{m.position}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Berita & Acara (dinamis dari DB) */}
      <section className="section section-dark">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-title m-0">Berita & Acara</h2>
          <Link to="/berita" className="btn btn-outline-info btn-sm">
            Lihat semua →
          </Link>
        </div>

        {newsLoading && (
          <div className="card card-dark p-3 mb-3">
            <span className="text-white-80">Memuat berita…</span>
          </div>
        )}

        {newsErr && (
          <div className="card card-dark p-3 mb-3">
            <span className="text-danger">{newsErr}</span>
          </div>
        )}

        {!newsLoading && !newsErr && (
          <>
            {/* 4 kartu utama */}
            <div className="row">
              {newsTop.map((n) => (
                <div className="col-md-6 mb-4" key={n.slug}>
                  <div className="card shadow-sm h-100 card-dark">
                    <div className="row g-0">
                      <div className="col-md-4">
                        {n.image && (
                          <img
                            src={asAbsolute(n.image)}
                            className="img-fluid rounded-start h-100 w-100"
                            alt={n.title}
                            style={{ objectFit: "cover" }}
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <small className="text-tanggal d-block mb-2">
                            {new Date(n.date).toLocaleDateString("id-ID")}
                          </small>
                          <h5 className="card-title text-light">{n.title}</h5>
                          <p className="text-white-80">{n.excerpt}</p>
                          <Link
                            to={`/berita/${n.slug}`}
                            className="text-info fw-bold text-decoration-none"
                          >
                            read more...
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {!newsTop.length && (
                <p className="text-center text-white-80">Belum ada berita.</p>
              )}
            </div>

            {/* List kecil di bawahnya */}
            {newsList.length > 0 && (
              <div className="card card-dark p-3 news-list">
                <ul className="list-group list-group-flush">
                  {newsList.map((n) => (
                    <li
                      key={n.slug}
                      className="list-group-item d-flex justify-content-between align-items-start"
                    >
                      <div>
                        <Link
                          to={`/berita/${n.slug}`}
                          className="text-info fw-semibold text-decoration-none"
                        >
                          {n.title}
                        </Link>
                        <div className="small text-white-50">
                          {n.venue ? `${n.venue} • ` : ""}
                          {new Date(n.date).toLocaleDateString("id-ID")}
                          {n.category ? ` • ${n.category}` : ""}
                        </div>
                      </div>
                      <div className="small text-white-50 ms-2">
                        {/* tag atau kategori kecil */}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </section>

      {/* Our Collaborations */}
      <section className="section section-dark">
        <h2 className="section-title text-center mb-3">Our Collaborations</h2>

        {loadingCollab && (
          <div className="card card-dark p-3 mb-4 text-center">
            <span className="text-white-80">Memuat kolaborasi…</span>
          </div>
        )}

        {errCollab && (
          <div className="card card-dark p-3 mb-4 text-center">
            <span className="text-danger">{errCollab}</span>
          </div>
        )}

        {!loadingCollab && !errCollab && collabs.length > 0 && (
          <CollabMarquee items={collabs} height={90} gap={34} duration={28} />
        )}

        {!loadingCollab && !errCollab && collabs.length === 0 && (
          <div className="card card-dark p-3 text-center">
            <span className="text-white-80">Belum ada data kolaborasi.</span>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
