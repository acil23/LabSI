import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import NewsHeroCarousel from "../components/NewsHeroCarousel";
import { getNews } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { t } from "../translations/translations";

function formatDate(iso) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")} / ${String(
    d.getMonth() + 1
  ).padStart(2, "0")} / ${d.getFullYear()}`;
}

export default function BeritaIndex() {
  const { lang } = useLanguage();
  const [heroItems, setHeroItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [meta, setMeta] = useState({ count: 0, page: 1, perPage: 6 });
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const perPage = 6;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getNews({ page, perPage });
        setItems(res.data || []);
        setMeta({ count: res.count, page: res.page, perPage: res.perPage });
        
        // 1) coba ambil yang pinned (maks 5)
        let pinnedRes;
        try {
          pinnedRes = await getNews({ page: 1, perPage: 5, pinned: true });
        } catch (_) {
          pinnedRes = { data: [] };
        }

        if (pinnedRes.data?.length) {
          setHeroItems(pinnedRes.data);
        } else {
          // 2) fallback ambil 5 terbaru
          const latest = await getNews({ page: 1, perPage: 5 });
          setHeroItems(latest.data || []);
        }
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(meta.count / meta.perPage));
  const go = (p) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setSearchParams(next === 1 ? {} : { page: String(next) });
  };

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
        staggerChildren: 0.1
      }
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  };

  if (err) return (
    <section className="section section-dark">
      <motion.p 
        className="text-danger text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {err}
      </motion.p>
    </section>
  );

  return (
    <section className="section section-dark">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
        className="text-center mb-5"
      >
        <motion.div
          className="d-inline-block mb-3"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="badge bg-info text-dark px-4 py-2" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
            📰 {t(lang, 'news.badge')}
          </span>
        </motion.div>
        
        <h2 className="section-title mb-3" style={{ fontSize: '2.5rem' }}>
          {t(lang, 'news.title')} & <span className="text-info">{t(lang, 'news.title_highlight')}</span>
        </h2>
        
        <motion.div 
          className="mx-auto"
          style={{ 
            width: '80px', 
            height: '4px', 
            background: 'linear-gradient(90deg, transparent, #17a2b8, transparent)',
            borderRadius: '2px'
          }}
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        
        <motion.p 
          className="text-white-50 mt-3"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
        >
          {t(lang, 'news.subtitle')}
        </motion.p>
      </motion.div>

      {/* HERO CAROUSEL */}
      {!!heroItems.length && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-5"
        >
          <NewsHeroCarousel items={heroItems} />
        </motion.div>
      )}

      {/* Loading State */}
      {loading ? (
        <motion.div 
          className="text-center py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ display: 'inline-block' }}
          >
            <div 
              className="spinner-border text-info" 
              role="status"
              style={{ width: '3rem', height: '3rem' }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </motion.div>
          <p className="text-white-50 mt-3">{t(lang, 'news.loading')}</p>
        </motion.div>
      ) : (
        <>
          {/* News Grid */}
          <AnimatePresence mode="wait">
            <motion.div 
              className="row"
              key={page}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {items.map((n, index) => (
                <motion.div 
                  className="col-md-6 mb-4" 
                  key={n.id}
                  variants={cardVariant}
                  custom={index}
                >
                  <motion.div 
                    className="card shadow-sm h-100 card-dark"
                    style={{ 
                      borderRadius: '16px',
                      border: '1px solid rgba(23, 162, 184, 0.2)',
                      background: 'rgba(23, 162, 184, 0.03)',
                      overflow: 'hidden'
                    }}
                    whileHover={{ 
                      y: -8,
                      boxShadow: '0 20px 40px rgba(23, 162, 184, 0.2)',
                      borderColor: 'rgba(23, 162, 184, 0.4)',
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className="row g-0 h-100">
                      <div className="col-md-4">
                        <motion.div
                          className="h-100 overflow-hidden"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <img
                            src={n.image}
                            loading="lazy"
                            className="img-fluid h-100 w-100"
                            alt={n.title}
                            style={{ objectFit: "cover" }}
                          />
                        </motion.div>
                      </div>
                      <div className="col-md-8">
                        <div className="card-body d-flex flex-column h-100">
                          <div>
                            <small className="text-info d-block mb-2 fw-semibold" style={{ fontSize: '0.8rem' }}>
                              📅 {formatDate(n.date)}
                            </small>
                            <h5 className="card-title text-light mb-2" style={{ fontSize: '1.1rem' }}>
                              {n.title}
                            </h5>
                            <p className="text-white-80 mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                              {n.excerpt}
                            </p>
                          </div>
                          <div className="mt-auto">
                            <motion.div
                              whileHover={{ x: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Link
                                to={`/berita/${n.slug}`}
                                className="text-info fw-bold text-decoration-none"
                                style={{ fontSize: '0.9rem' }}
                              >
                                {t(lang, 'news.read_more')} →
                              </Link>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}

              {!items.length && (
                <motion.div 
                  className="col-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div 
                    className="text-center py-5"
                    style={{ 
                      background: 'rgba(23, 162, 184, 0.05)',
                      borderRadius: '16px',
                      border: '1px dashed rgba(23, 162, 184, 0.3)'
                    }}
                  >
                    <div style={{ fontSize: '3rem' }}>📭</div>
                    <h5 className="text-white-50 mt-3">{t(lang, 'news.no_news')}</h5>
                    <p className="text-white-50 small">{t(lang, 'news.no_news_desc')}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.nav 
              aria-label="Navigasi halaman"
              className="mt-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ul className="pagination justify-content-center">
                <motion.li 
                  className={`page-item ${page === 1 ? "disabled" : ""}`}
                  whileHover={page !== 1 ? { scale: 1.05 } : {}}
                >
                  <button 
                    className="page-link bg-dark text-info border-secondary"
                    onClick={() => go(page - 1)}
                    style={{ borderRadius: '8px 0 0 8px' }}
                  >
                    ← Previous
                  </button>
                </motion.li>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <motion.li 
                    key={p} 
                    className={`page-item ${p === page ? "active" : ""}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button 
                      className={`page-link ${p === page ? 'bg-info text-dark border-info' : 'bg-dark text-light border-secondary'}`}
                      onClick={() => go(p)}
                    >
                      {p}
                    </button>
                  </motion.li>
                ))}
                
                <motion.li 
                  className={`page-item ${page === totalPages ? "disabled" : ""}`}
                  whileHover={page !== totalPages ? { scale: 1.05 } : {}}
                >
                  <button 
                    className="page-link bg-dark text-info border-secondary"
                    onClick={() => go(page + 1)}
                    style={{ borderRadius: '0 8px 8px 0' }}
                  >
                    Next →
                  </button>
                </motion.li>
              </ul>
            </motion.nav>
          )}
        </>
      )}
    </section>
  );
}
