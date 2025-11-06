import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNews } from "../lib/api";
import { getMembers } from "../lib/api";
import { asAbsolute } from "../lib/http";
import { getCollaborations } from "../lib/api";
import CollabMarquee from "../components/CollabMarquee";
import heroImage from "../../public/assets/gambar/hero-image.png";
import { motion } from 'framer-motion';

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
        const res = await getNews({ page: 1, perPage: 12 });
        const arr = res.data || [];
        setNewsTop(arr.slice(0, 4));
        setNewsList(arr.slice(4, 9));
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

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-light">
        {/* Background geometric elements */}
        <div className="geometric-bg">
          <motion.div 
            className="circle-1"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="circle-2"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.div 
            className="circle-3"
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div 
            className="dots-pattern"
            animate={{ 
              x: [0, 10, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="dots-pattern-2"
            animate={{ 
              x: [0, -15, 0],
              y: [0, 15, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="curved-lines">
            <motion.div 
              className="curved-line-1"
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="curved-line-2"
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 1 }}
            />
          </div>
        </div>

        {/* Main hero content */}
        <div className="hero-content">
          <motion.div 
            className="hero-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="hero-text">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h1>Exploring the Frontiers of Artificial Intelligence</h1>
                  </motion.div>
                  <motion.p 
                    className="lead mt-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Our lab is a hub for pioneering research and real-world applications, where we're dedicated to reshaping the landscape of smart technology. From transformative projects to strategic collaborations, we're set to make a significant mark in the world of IT.
                  </motion.p>
                  <br />
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    Whether you're into AI, machine learning, NLP, CV, or just curious — this is where you belong.
                  </motion.p>
                </div>
              </div>
              <div className="col-md-6">
                <motion.div 
                  className="hero-image-container"
                  initial={{ opacity: 0, scale: 0.8, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.4 }}
                >
                  <motion.div 
                    className="hero-image-wrapper"
                    animate={{ 
                      y: [0, -15, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <img
                      src={heroImage}
                      alt="Hero visual"
                      className="img-fluid"
                    />
                  </motion.div>
                </motion.div>
              </div>
              <motion.div 
                className="hero-buttons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="https://www.instagram.com/is.lab.filkom/" className="btn btn-primary btn-lg">Join Us</Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/about" className="btn btn-outline-light btn-lg">More...</Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Face of IS Lab */}
      <motion.section 
        className="section section-dark"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="d-flex justify-content-between align-items-center mb-3"
          variants={fadeInUp}
        >
          <h2 className="section-title m-0">Face Of IS Lab</h2>
          <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
            <Link to="/anggota" className="btn btn-outline-info btn-sm">
              Lihat Semua →
            </Link>
          </motion.div>
        </motion.div>

        {loadingMembers && <p className="text-white-80">Memuat anggota...</p>}
        {errMembers && <p className="text-danger">{errMembers}</p>}

        <motion.div 
          className="row"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {members.map((m) => (
            <motion.div 
              className="col-md-4 col-lg-3 mb-4" 
              key={m.id}
              variants={scaleIn}
              transition={{ duration: 0.5 }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <div className="card card-dark text-center h-100 p-3">
                {m.avatar_url && (
                  <motion.img
                    src={asAbsolute(m.avatar_url)}
                    alt={m.name}
                    className="rounded-circle mx-auto mb-3"
                    style={{ width: 120, height: 120, objectFit: "cover" }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <h5 className="text-light">{m.name}</h5>
                <p className="text-white-80 small mb-1">{m.title}</p>
                <p className="text-info small">{m.position}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Berita & Acara */}
      <motion.section 
        className="section section-dark"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="d-flex justify-content-between align-items-center mb-3"
          variants={fadeInUp}
        >
          <h2 className="section-title m-0">Berita & Acara</h2>
          <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
            <Link to="/berita" className="btn btn-outline-info btn-sm">
              Lihat semua →
            </Link>
          </motion.div>
        </motion.div>

        {newsLoading && (
          <motion.div 
            className="card card-dark p-3 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-white-80">Memuat berita…</span>
          </motion.div>
        )}

        {newsErr && (
          <motion.div 
            className="card card-dark p-3 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-danger">{newsErr}</span>
          </motion.div>
        )}

        {!newsLoading && !newsErr && (
          <>
            <motion.div 
              className="row"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {newsTop.map((n) => (
                <motion.div 
                  className="col-md-6 mb-4" 
                  key={n.slug}
                  variants={fadeInUp}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="card shadow-sm h-100 card-dark">
                    <div className="row g-0">
                      <div className="col-md-4">
                        {n.image && (
                          <motion.img
                            src={asAbsolute(n.image)}
                            className="img-fluid rounded-start h-100 w-100"
                            alt={n.title}
                            style={{ objectFit: "cover" }}
                            loading="lazy"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
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
                          <motion.div whileHover={{ x: 5 }}>
                            <Link
                              to={`/berita/${n.slug}`}
                              className="text-info fw-bold text-decoration-none"
                            >
                              read more...
                            </Link>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {!newsTop.length && (
                <p className="text-center text-white-80">Belum ada berita.</p>
              )}
            </motion.div>

            {newsList.length > 0 && (
              <motion.div 
                className="card card-dark p-3 news-list"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <ul className="list-group list-group-flush">
                  {newsList.map((n, index) => (
                    <motion.li
                      key={n.slug}
                      className="list-group-item d-flex justify-content-between align-items-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.05)" }}
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
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </>
        )}
      </motion.section>

      {/* Our Collaborations */}
      <motion.section 
        className="section section-dark"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <motion.h2 
          className="section-title text-center mb-3"
          variants={fadeInUp}
        >
          Our Collaborations
        </motion.h2>

        {loadingCollab && (
          <motion.div 
            className="card card-dark p-3 mb-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-white-80">Memuat kolaborasi…</span>
          </motion.div>
        )}

        {errCollab && (
          <motion.div 
            className="card card-dark p-3 mb-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-danger">{errCollab}</span>
          </motion.div>
        )}

        {!loadingCollab && !errCollab && collabs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <CollabMarquee items={collabs} height={90} gap={34} duration={28} />
          </motion.div>
        )}

        {!loadingCollab && !errCollab && collabs.length === 0 && (
          <motion.div 
            className="card card-dark p-3 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-white-80">Belum ada data kolaborasi.</span>
          </motion.div>
        )}
      </motion.section>
    </div>
  );
}

export default Home;
