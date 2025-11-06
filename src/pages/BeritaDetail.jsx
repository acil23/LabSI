import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getNewsBySlug, getNews } from "../lib/api";
import { motion } from "framer-motion";

function formatDate(iso) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")} / ${String(d.getMonth() + 1).padStart(2, "0")} / ${d.getFullYear()}`;
}

export default function BeritaDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [others, setOthers] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getNewsBySlug(slug);
        setItem(data);
        // ambil 4 lain terbaru
        const list = await getNews({ page: 1, perPage: 8 });
        setOthers((list.data || []).filter(n => n.slug !== slug).slice(0, 4));
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
        <p className="text-white-50 mt-3">Memuat berita...</p>
      </motion.div>
    </section>
  );

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

  if (!item) return null;

  return (
    <section className="section section-dark pb-5">
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
          <Link to="/berita" className="btn btn-outline-info">
            ← Kembali ke daftar
          </Link>
        </motion.div>
      </motion.div>

      {/* Main Article */}
      <motion.article 
        className="card card-dark p-4 mb-5"
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
          {/* Image */}
          {item.image && (
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
                src={item.image}
                alt={item.title}
                className="img-fluid w-100"
                style={{ maxHeight: 400, objectFit: "cover" }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )}

          {/* Metadata */}
          <motion.div 
            className="mb-3"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className="badge bg-info text-dark px-3 py-2">
                📅 {formatDate(item.date)}
              </span>
              {item.category && (
                <span className="badge bg-dark text-info px-3 py-2">
                  🏷️ {item.category}
                </span>
              )}
              {item.venue && (
                <span className="badge bg-dark text-info px-3 py-2">
                  📍 {item.venue}
                </span>
              )}
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1 
            className="mb-4 text-light"
            style={{ fontSize: '2.2rem', lineHeight: '1.3' }}
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
          >
            {item.title}
          </motion.h1>

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
            transition={{ duration: 0.8, delay: 0.4 }}
          />

          {/* Content */}
          <motion.div 
            className="mt-4 text-light"
            style={{ 
              fontSize: '1.05rem', 
              lineHeight: '1.8',
              '& p': { marginBottom: '1.2rem' },
              '& img': { maxWidth: '100%', borderRadius: '12px', margin: '20px 0' }
            }}
            variants={fadeInUp}
            transition={{ delay: 0.5 }}
            dangerouslySetInnerHTML={{ __html: item.content }} 
          />
        </div>
      </motion.article>

      {/* Related News */}
      {others.length > 0 && (
        <motion.div 
          className="mt-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <div className="d-flex align-items-center mb-4">
            <motion.div
              className="bg-info d-flex align-items-center justify-content-center me-3"
              style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '12px',
                fontSize: '1.5rem'
              }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              📰
            </motion.div>
            <h3 className="text-light mb-0" style={{ fontSize: '1.8rem' }}>
              Berita Lainnya
            </h3>
          </div>

          <motion.div
            style={{
              width: '60px',
              height: '4px',
              background: '#17a2b8',
              borderRadius: '2px',
              marginBottom: '30px'
            }}
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <motion.div 
            className="row"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {others.map((n, index) => (
              <motion.div 
                className="col-md-6 mb-4" 
                key={n.id}
                variants={fadeInUp}
                custom={index}
              >
                <motion.div 
                  className="card card-dark p-3 h-100"
                  style={{ 
                    borderRadius: '16px',
                    border: '1px solid rgba(23, 162, 184, 0.2)',
                    background: 'rgba(23, 162, 184, 0.03)'
                  }}
                  whileHover={{ 
                    y: -8,
                    boxShadow: '0 15px 30px rgba(23, 162, 184, 0.2)',
                    borderColor: 'rgba(23, 162, 184, 0.4)',
                    transition: { duration: 0.3 }
                  }}
                >
                  <small className="text-info d-block mb-2 fw-semibold" style={{ fontSize: '0.8rem' }}>
                    📅 {formatDate(n.date)}
                  </small>
                  <h4 className="text-light mb-2" style={{ fontSize: '1.1rem' }}>
                    {n.title}
                  </h4>
                  <p className="mb-3 text-white-80" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {n.excerpt}
                  </p>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link 
                      to={`/berita/${n.slug}`} 
                      className="text-info fw-bold text-decoration-none"
                      style={{ fontSize: '0.9rem' }}
                    >
                      read more →
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
