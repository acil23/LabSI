// src/pages/AnggotaDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMemberDetailBySlug } from "../lib/apiMembers";
import { motion } from "framer-motion";

export default function AnggotaDetail() {
  const { slug } = useParams();
  const [member, setMember] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const m = await getMemberDetailBySlug(slug);
        setMember(m);
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

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
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
        <p className="text-white-50 mt-3">Memuat profil...</p>
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

  if (!member) return (
    <section className="section section-dark text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ fontSize: '4rem' }}>😕</div>
        <p className="text-white-50 mt-3">Profil tidak ditemukan</p>
        <Link to="/anggota" className="btn btn-outline-info mt-3">
          ← Kembali ke daftar
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
            <Link to="/anggota" className="btn btn-outline-info">
              ← Kembali ke daftar
            </Link>
          </motion.div>
        </motion.div>

        {/* ====== HEADER: 2 kolom ====== */}
        <motion.div 
          className="row g-4 align-items-start mb-4"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* LEFT - Profile Card */}
          <motion.div 
            className="col-lg-4"
            variants={fadeInLeft}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="card card-dark p-4 h-100 text-center"
              style={{ 
                borderRadius: '20px',
                border: '1px solid rgba(23, 162, 184, 0.3)',
                background: 'rgba(23, 162, 184, 0.05)',
                position: 'relative',
                overflow: 'hidden'
              }}
              whileHover={{ 
                boxShadow: '0 20px 50px rgba(23, 162, 184, 0.2)',
                transition: { duration: 0.3 }
              }}
            >
              {/* Decorative background element */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '150px',
                  height: '150px',
                  background: 'radial-gradient(circle, rgba(23, 162, 184, 0.1), transparent)',
                  borderRadius: '50%',
                  zIndex: 0
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                >
                  <motion.img
                    src={member.avatar_url}
                    alt={member.name}
                    className="rounded-circle mb-3"
                    style={{ 
                      width: 180, 
                      height: 180, 
                      objectFit: "cover",
                      border: '4px solid #17a2b8',
                      padding: '4px',
                      background: '#000'
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                
                <motion.h4 
                  className="text-light mb-1"
                  variants={fadeInUp}
                  transition={{ delay: 0.3 }}
                >
                  {member.name}
                </motion.h4>
                
                {member.title && (
                  <motion.div 
                    className="text-white-80 mb-2"
                    variants={fadeInUp}
                    transition={{ delay: 0.4 }}
                  >
                    {member.title}
                  </motion.div>
                )}
                
                {member.position && (
                  <motion.div
                    variants={fadeInUp}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="badge bg-info text-dark px-3 py-2 mb-3">
                      {member.position}
                    </span>
                  </motion.div>
                )}
                
                {member.email && (
                  <motion.div 
                    className="mt-3"
                    variants={fadeInUp}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.a 
                      href={`mailto:${member.email}`} 
                      className="btn btn-sm btn-outline-info"
                      style={{ borderRadius: '10px' }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ✉️ {member.email}
                    </motion.a>
                  </motion.div>
                )}

                {/* Tags spesialis */}
                {(member.member_specialists || []).length > 0 && (
                  <>
                    <hr className="border-secondary my-4" />
                    <motion.div 
                      className="d-flex flex-wrap gap-2 justify-content-center"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {member.member_specialists
                        .map((ms) => ms.spec?.name)
                        .filter(Boolean)
                        .map((s, index) => (
                          <motion.span 
                            key={s} 
                            className="badge rounded-pill bg-primary"
                            variants={scaleIn}
                            custom={index}
                            whileHover={{ scale: 1.1, y: -3 }}
                          >
                            {s}
                          </motion.span>
                        ))}
                    </motion.div>
                  </>
                )}

                {/* Skills */}
                {member.skills?.length ? (
                  <motion.div
                    variants={fadeInUp}
                    transition={{ delay: 0.7 }}
                  >
                    <h6 className="mt-4 text-info mb-3">🎯 Bidang Keahlian</h6>
                    <ul className="list-unstyled text-start mb-0">
                      {member.skills.map((s, i) => (
                        <motion.li 
                          key={i}
                          className="mb-2 text-white-80"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + i * 0.1 }}
                          whileHover={{ x: 5, color: '#17a2b8' }}
                        >
                          • {s.skill_name}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ) : null}

                {/* Certifications */}
                {member.certifications?.length ? (
                  <motion.div
                    variants={fadeInUp}
                    transition={{ delay: 0.8 }}
                  >
                    <h6 className="mt-4 text-info mb-3">🏆 Sertifikasi</h6>
                    <ul className="list-unstyled text-start mb-0">
                      {member.certifications.map((c, i) => (
                        <motion.li 
                          key={i}
                          className="mb-2 text-white-80 small"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + i * 0.1 }}
                          whileHover={{ x: 5, color: '#17a2b8' }}
                        >
                          • {c.cert_name}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT - About */}
          <motion.div 
            className="col-lg-8"
            variants={fadeInRight}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="card card-dark p-4 h-100"
              style={{ 
                borderRadius: '20px',
                border: '1px solid rgba(23, 162, 184, 0.3)',
                background: 'rgba(23, 162, 184, 0.05)'
              }}
              whileHover={{ 
                boxShadow: '0 15px 40px rgba(23, 162, 184, 0.15)',
                transition: { duration: 0.3 }
              }}
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
                  👤
                </motion.div>
                <h5 className="text-light mb-0">Tentang</h5>
              </div>
              
              <motion.div
                style={{
                  width: '60px',
                  height: '4px',
                  background: '#17a2b8',
                  borderRadius: '2px',
                  marginBottom: '20px'
                }}
                initial={{ width: 0 }}
                animate={{ width: 60 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              
              <motion.p 
                className="text-white mb-0"
                style={{ lineHeight: '1.8', fontSize: '1rem' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {member.bio || "Belum ada informasi biografis."}
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ====== EXPERIENCES ====== */}
        {member.experiences?.length ? (
          <motion.div 
            className="card card-dark p-4 mb-4"
            style={{ 
              borderRadius: '20px',
              border: '1px solid rgba(23, 162, 184, 0.3)',
              background: 'rgba(23, 162, 184, 0.05)'
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            whileHover={{ 
              boxShadow: '0 15px 40px rgba(23, 162, 184, 0.15)',
              transition: { duration: 0.3 }
            }}
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
                💼
              </motion.div>
              <h5 className="text-light mb-0">Pengalaman</h5>
            </div>
            
            <motion.div
              style={{
                width: '60px',
                height: '4px',
                background: '#17a2b8',
                borderRadius: '2px',
                marginBottom: '20px'
              }}
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            
            <ul className="list-unstyled mb-0">
              {member.experiences.map((ex, i) => (
                <motion.li 
                  key={i} 
                  className="mb-4 pb-3"
                  style={{ borderBottom: i < member.experiences.length - 1 ? '1px solid rgba(23, 162, 184, 0.2)' : 'none' }}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 10, transition: { duration: 0.2 } }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <strong className="text-info" style={{ fontSize: '1.1rem' }}>
                        {ex.role}
                      </strong>
                      {ex.org && (
                        <span className="text-white-80"> — {ex.org}</span>
                      )}
                    </div>
                    {ex.period && (
                      <span className="badge bg-dark text-info">
                        {ex.period}
                      </span>
                    )}
                  </div>
                  {ex.bullets?.length ? (
                    <ul className="mt-2 text-white-80">
                      {ex.bullets.map((b, j) => (
                        <motion.li 
                          key={j}
                          className="mb-1"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 + j * 0.05 }}
                        >
                          {b}
                        </motion.li>
                      ))}
                    </ul>
                  ) : null}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : null}

        {/* ====== EDUCATION ====== */}
        {member.educations?.length ? (
          <motion.div 
            className="card card-dark p-4 mb-5"
            style={{ 
              borderRadius: '20px',
              border: '1px solid rgba(23, 162, 184, 0.3)',
              background: 'rgba(23, 162, 184, 0.05)'
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            whileHover={{ 
              boxShadow: '0 15px 40px rgba(23, 162, 184, 0.15)',
              transition: { duration: 0.3 }
            }}
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
                🎓
              </motion.div>
              <h5 className="text-light mb-0">Pendidikan</h5>
            </div>
            
            <motion.div
              style={{
                width: '60px',
                height: '4px',
                background: '#17a2b8',
                borderRadius: '2px',
                marginBottom: '20px'
              }}
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            
            <ul className="list-unstyled mb-0">
              {member.educations.map((ed, i) => (
                <motion.li 
                  key={i} 
                  className="mb-3"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 10, transition: { duration: 0.2 } }}
                >
                  <strong className="text-info" style={{ fontSize: '1.05rem' }}>
                    {ed.degree}
                  </strong>
                  {ed.org && (
                    <span className="text-white"> — {ed.org}</span>
                  )}
                  {ed.year && (
                    <span className="text-white-50"> ({ed.year})</span>
                  )}
                  {ed.note && (
                    <div className="text-white-80 small mt-1">{ed.note}</div>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : null}

        {/* Back button bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/anggota" className="btn btn-outline-info">
              ← Kembali ke daftar
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
