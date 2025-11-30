import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJournalBySlug } from "../lib/api";
import { asAbsolute } from "../lib/http";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { t } from "../translations/translations";

export default function JurnalDetail() {
  const { lang } = useLanguage();
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const d = await getJournalBySlug(slug);
        setData(d);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

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

  if (loading) return (
    <section className="section section-dark text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
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
        <p className="text-white-50 mt-3">{t(lang, 'publication_detail.loading')}</p>
      </motion.div>
    </section>
  );

  if (err) return (
    <section className="section section-dark text-center">
      <motion.p 
        className="text-danger"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {err}
      </motion.p>
    </section>
  );

  if (!data) return (
    <section className="section section-dark text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ fontSize: '4rem' }}>📄</div>
        <p className="text-white-50 mt-3">{t(lang, 'publication_detail.not_found')}</p>
        <Link to="/jurnal" className="btn btn-outline-info mt-3">
          ← {t(lang, 'publication_detail.btn_back')}
        </Link>
      </motion.div>
    </section>
  );

  return (
    <section className="section section-dark pb-5">
      <div className="container">
        {/* Back button */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/jurnal" className="btn btn-outline-info">
              ← Kembali ke daftar
            </Link>
          </motion.div>
        </motion.div>

        {/* Main Card */}
        <motion.div 
          className="card card-dark p-5"
          style={{ 
            borderRadius: '20px',
            border: '1px solid rgba(23, 162, 184, 0.3)',
            background: 'rgba(23, 162, 184, 0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Decorative background */}
          <motion.div
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(23, 162, 184, 0.1), transparent)',
              borderRadius: '50%',
              zIndex: 0
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Thumbnail */}
            {data.thumb_url && (
              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.8 }}
                className="mb-4"
                style={{ 
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(23, 162, 184, 0.2)'
                }}
              >
                <motion.img
                  src={asAbsolute(data.thumb_url)}
                  alt={data.title}
                  className="img-fluid w-100"
                  style={{ maxHeight: 350, objectFit: "cover" }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            )}

            {/* Badges */}
            <motion.div 
              className="mb-4"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <div className="d-flex flex-wrap gap-2">
                <span className="badge bg-info text-dark px-3 py-2">
                  📅 {data.year}
                </span>
                <span className="badge bg-dark text-info px-3 py-2">
                  📝 {data.type}
                </span>
                {data.venue && (
                  <span className="badge bg-dark text-info px-3 py-2">
                    📍 {data.venue}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2 
              className="text-light mb-3"
              style={{ fontSize: '2.2rem', lineHeight: '1.3' }}
              variants={fadeInUp}
              transition={{ delay: 0.3 }}
            >
              {data.title}
            </motion.h2>

            {/* Authors */}
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
              className="mb-4"
            >
              <div className="d-flex align-items-center mb-2">
                <motion.div
                  className="bg-info d-flex align-items-center justify-content-center me-2"
                  style={{ 
                    width: '35px', 
                    height: '35px', 
                    borderRadius: '8px',
                    fontSize: '1.2rem'
                  }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  👥
                </motion.div>
                <strong className="text-info">{t(lang, 'publication_detail.authors')}:</strong>
              </div>
              <p className="text-white ms-5">{data.authors}</p>
            </motion.div>

            {/* Divider */}
            <motion.div
              style={{
                width: '80px',
                height: '4px',
                background: '#17a2b8',
                borderRadius: '2px',
                marginBottom: '30px'
              }}
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />

            {/* Abstract */}
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.6 }}
              className="mb-4"
            >
              <div className="d-flex align-items-center mb-3">
                <motion.div
                  className="bg-info d-flex align-items-center justify-content-center me-2"
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '10px',
                    fontSize: '1.3rem'
                  }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  📋
                </motion.div>
                <h4 className="text-light mb-0">{t(lang, 'publication_detail.abstract')}</h4>
              </div>
              <motion.div
                className="p-4 rounded-3"
                style={{ 
                  background: 'rgba(23, 162, 184, 0.08)',
                  border: '1px solid rgba(23, 162, 184, 0.2)'
                }}
                whileHover={{ 
                  background: 'rgba(23, 162, 184, 0.12)',
                  transition: { duration: 0.3 }
                }}
              >
                <p className="text-white mb-0" style={{ lineHeight: '1.8', textAlign: 'justify' }}>
                  {data.abstract || "{t(lang, 'publication_detail.no_abstract')}"}
                </p>
              </motion.div>
            </motion.div>

            {/* DOI */}
            {data.doi && (
              <motion.div
                variants={fadeInUp}
                transition={{ delay: 0.7 }}
                className="mb-4"
              >
                <div className="d-flex align-items-center mb-2">
                  <motion.div
                    className="bg-info d-flex align-items-center justify-content-center me-2"
                    style={{ 
                      width: '35px', 
                      height: '35px', 
                      borderRadius: '8px',
                      fontSize: '1.2rem'
                    }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    🔗
                  </motion.div>
                  <strong className="text-info">DOI:</strong>
                </div>
                <motion.a 
                  href={`https://doi.org/${data.doi}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-info text-decoration-none ms-5"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {data.doi} →
                </motion.a>
              </motion.div>
            )}

            {/* PDF Button */}
            {data.pdf_url && (
              <motion.div
                variants={fadeInUp}
                transition={{ delay: 0.8 }}
                className="mt-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href={asAbsolute(data.pdf_url)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-info text-dark btn-lg px-5 py-3 fw-semibold"
                    style={{ 
                      borderRadius: '12px',
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 15px rgba(23, 162, 184, 0.3)'
                    }}
                  >
                    📄 {t(lang, 'publication_detail.btn_download')}
                  </a>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Bottom back button */}
        <motion.div
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/jurnal" className="btn btn-outline-info">
              ← {t(lang, 'publication_detail.btn_back')}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
