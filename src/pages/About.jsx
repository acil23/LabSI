import React from "react";
import { Link } from "react-router-dom";
import NeuralNetworkBackground from "../components/NeuralNetworkBackground";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { t } from "../translations/translations";

export default function About() {
  const { lang } = useLanguage();
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
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="page-with-bg">
      <NeuralNetworkBackground />

      {/* HERO SECTION - Enhanced */}
      <section className="section section-dark pb-5" style={{ paddingTop: '100px' }}>
        <motion.header 
          className="about-hero text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.02, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ display: 'inline-block' }}
            >
              <span className="badge bg-info text-dark px-4 py-2 mb-3" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
                {t(lang, 'about.badge')}
              </span>
            </motion.div>
          </motion.div>
          
          <motion.h1 
            className="display-4 fw-bold mb-4 text-white"
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ lineHeight: '1.3' }}
          >
            {t(lang, 'about.title')}<br />
            <span className="text-info">{t(lang, 'about.title_highlight')}</span>
          </motion.h1>
          
          <motion.p 
            className="lead text-white-50 m-auto mb-4" 
            style={{ maxWidth: 800, fontSize: '1.1rem' }}
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t(lang, 'about.subtitle')}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
                <span className="badge bg-dark text-info px-3 py-2" style={{ fontSize: '0.85rem' }}>
                  🤖 {t(lang, 'about.topics.ml')}
                </span>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
                <span className="badge bg-dark text-info px-3 py-2" style={{ fontSize: '0.85rem' }}>
                  🧠 {t(lang, 'about.topics.dl')}
                </span>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
                <span className="badge bg-dark text-info px-3 py-2" style={{ fontSize: '0.85rem' }}>
                  👁️ {t(lang, 'about.topics.cv')}
                </span>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
                <span className="badge bg-dark text-info px-3 py-2" style={{ fontSize: '0.85rem' }}>
                  💬 {t(lang, 'about.topics.nlp')}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </motion.header>
      </section>

      {/* SEKILAS - Enhanced Layout */}
      <section className="section section-dark py-5">
        <div className="container-xxl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-5">
              <motion.h2 
                className="section-title mb-3"
                style={{ fontSize: '2.5rem', fontWeight: '700' }}
              >
                {t(lang, 'about.overview_title')} <span className="text-info">{t(lang, 'about.overview_subtitle')}</span>
              </motion.h2>
              <motion.div 
                className="mx-auto mb-3"
                style={{ 
                  width: '80px', 
                  height: '4px', 
                  background: 'linear-gradient(90deg, transparent, #17a2b8, transparent)',
                  borderRadius: '2px'
                }}
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          </motion.div>

          <div className="row align-items-center g-5">
            <motion.div 
              className="col-lg-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInLeft}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="about-card p-4 p-md-5 h-100"
                style={{ 
                  background: 'rgba(23, 162, 184, 0.05)',
                  border: '1px solid rgba(23, 162, 184, 0.2)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)'
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 20px 40px rgba(23, 162, 184, 0.15)',
                  transition: { duration: 0.3 }
                }}
              >
                <div className="d-flex align-items-center mb-4">
                  <div 
                    className="bg-info d-flex align-items-center justify-content-center me-3"
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '12px',
                      fontSize: '1.5rem'
                    }}
                  >
                    🔬
                  </div>
                  <h3 className="text-info mb-0 fw-bold">{t(lang, 'about.vision_mission')}</h3>
                </div>
                
                <p className="mb-4 text-white" style={{ lineHeight: '1.8', fontSize: '1rem' }}>
                  {t(lang, 'about.desc1')}
                </p>
                
                <p className="mb-4 text-white-50" style={{ lineHeight: '1.8', fontSize: '0.95rem' }}>
                  {t(lang, 'about.desc2')}
                </p>
                
                <div 
                  className="p-3 rounded"
                  style={{ 
                    background: 'rgba(23, 162, 184, 0.1)',
                    borderLeft: '4px solid #17a2b8'
                  }}
                >
                  <p className="mb-0 text-white" style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>
                    <strong className="text-info">{t(lang, 'about.main_function')}</strong> {t(lang, 'about.function_desc')}
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="col-lg-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInRight}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="position-relative"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="about-photo shadow-lg overflow-hidden position-relative"
                  style={{ 
                    borderRadius: '24px',
                    height: '450px'
                  }}
                >
                  <motion.div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(23, 162, 184, 0.3), transparent)',
                      zIndex: 1
                    }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                  />
                  <img
                    src="/assets/about/lab-room.jpg"
                    alt="Ruang Laboratorium Sistem Cerdas"
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                  
                  {/* Floating badge */}
                  <motion.div
                    className="position-absolute bottom-0 start-0 m-4 p-3 rounded-3"
                    style={{ 
                      background: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(10px)',
                      zIndex: 2,
                      border: '1px solid rgba(23, 162, 184, 0.3)'
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <p className="mb-1 text-info fw-bold" style={{ fontSize: '0.9rem' }}>📍 {t(lang, 'about.location_label')}</p>
                    <p className="mb-0 text-white" style={{ fontSize: '0.85rem' }}>
                      {t(lang, 'about.location_building')}<br />{t(lang, 'about.location_campus')}
                    </p>
                  </motion.div>
                </div>
                
                {/* Decorative element */}
                <motion.div
                  className="position-absolute"
                  style={{
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, #17a2b8, transparent)',
                    borderRadius: '20px',
                    top: '-20px',
                    right: '-20px',
                    zIndex: -1,
                    opacity: 0.3
                  }}
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* KEPALA LAB - Enhanced */}
      <section className="section section-dark py-5">
        <div className="container-xxl">
          <motion.div
            className="about-head p-5 rounded-4"
            style={{ 
              background: 'linear-gradient(135deg, rgba(23, 162, 184, 0.1), rgba(23, 162, 184, 0.05))',
              border: '1px solid rgba(23, 162, 184, 0.2)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <div className="row g-4 align-items-center">
              <motion.div 
                className="col-md-3 text-center"
                variants={scaleIn}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src="/assets/about/pakYudis.jpg"
                    alt="Dr.Eng. Novanto Yudistira"
                    className="rounded-circle shadow-lg"
                    style={{
                      width: 180, 
                      height: 180, 
                      objectFit: "cover",
                      border: '4px solid #17a2b8',
                      padding: '4px',
                      background: '#000'
                    }}
                  />
                </motion.div>
                <motion.div
                  className="mt-3"
                  variants={fadeInUp}
                  transition={{ delay: 0.3 }}
                >
                  <span className="badge bg-info text-dark px-3 py-2">Kepala Laboratorium</span>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="col-md-9"
                variants={fadeInRight}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: 60 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="mb-3"
                  style={{ 
                    height: '4px', 
                    background: '#17a2b8',
                    borderRadius: '2px'
                  }}
                />
                
                <h3 className="fw-bold mb-2 text-white" style={{ fontSize: '1.3rem' }}>
                  {t(lang, 'about.head_welcome')} 👋
                </h3>
                
                <h4 className="mb-3 text-info fw-bold" style={{ fontSize: '1.8rem' }}>
                  Dr.Eng. Novanto Yudistira, S.Kom., M.Sc.
                </h4>
                
                <p className="text-white-50 mb-4" style={{ lineHeight: '1.7', fontSize: '0.95rem' }}>
                  {t(lang, 'about.head_desc')}
                </p>
                
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/anggota" 
                    className="btn btn-info fw-semibold px-4 py-2"
                    style={{ 
                      borderRadius: '10px',
                      fontSize: '1rem',
                      color: '#000'
                    }}
                  >
                    {t(lang, 'about.btn_team')}
                    <motion.span 
                      className="ms-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* KONTAK & SOSIAL - Enhanced Grid */}
      <section className="section section-dark py-5">
        <div className="container-xxl">
          <motion.div
            className="text-center mb-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title mb-2" style={{ fontSize: '2rem' }}>
              {t(lang, 'about.contact_title')} <span className="text-info">{t(lang, 'about.contact_subtitle')}</span>
            </h2>
            <p className="text-white-50">{t(lang, 'about.contact_desc')}</p>
          </motion.div>

          <motion.div 
            className="row g-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div 
              className="col-md-4"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="about-mini card-dark p-4 h-100 text-center"
                style={{ 
                  borderRadius: '16px',
                  border: '1px solid rgba(23, 162, 184, 0.2)',
                  background: 'rgba(23, 162, 184, 0.05)'
                }}
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 20px 40px rgba(23, 162, 184, 0.2)',
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div
                  className="mb-3"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <div 
                    className="bg-info d-inline-flex align-items-center justify-content-center"
                    style={{ 
                      width: '70px', 
                      height: '70px', 
                      borderRadius: '16px',
                      fontSize: '2rem'
                    }}
                  >
                    📍
                  </div>
                </motion.div>
                <h5 className="text-info mb-3 fw-bold">{t(lang, 'about.location_label')}</h5>
                <p className="mb-0 text-white" style={{ lineHeight: '1.8' }}>
                  <strong>{t(lang, 'about.location_campus')}</strong><br />
                  {t(lang, 'about.location_building')}<br />
                  <span className="text-white-50 small">Malang, Jawa Timur</span>
                </p>
              </motion.div>
            </motion.div>

            <motion.div 
              className="col-md-4"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="about-mini card-dark p-4 h-100 text-center"
                style={{ 
                  borderRadius: '16px',
                  border: '1px solid rgba(23, 162, 184, 0.2)',
                  background: 'rgba(23, 162, 184, 0.05)'
                }}
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 20px 40px rgba(23, 162, 184, 0.2)',
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div
                  className="mb-3"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <div 
                    className="bg-info d-inline-flex align-items-center justify-content-center"
                    style={{ 
                      width: '70px', 
                      height: '70px', 
                      borderRadius: '16px',
                      fontSize: '2rem'
                    }}
                  >
                    ✉️
                  </div>
                </motion.div>
                <h5 className="text-info mb-3 fw-bold">{t(lang, 'about.contact_email')}</h5>
                <motion.a 
                  href="mailto:labkc@ub.ac.id" 
                  className="text-white text-decoration-none d-block mb-2"
                  style={{ fontSize: '1.1rem', fontWeight: '500' }}
                  whileHover={{ scale: 1.05, color: '#17a2b8' }}
                >
                  labkc@ub.ac.id
                </motion.a>
                <p className="text-white-50 small mb-0">
                  Untuk keperluan kolaborasi & informasi
                </p>
              </motion.div>
            </motion.div>

            <motion.div 
              className="col-md-4"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div 
                className="about-mini card-dark p-4 h-100 text-center"
                style={{ 
                  borderRadius: '16px',
                  border: '1px solid rgba(23, 162, 184, 0.2)',
                  background: 'rgba(23, 162, 184, 0.05)'
                }}
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 20px 40px rgba(23, 162, 184, 0.2)',
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div
                  className="mb-3"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <div 
                    className="bg-info d-inline-flex align-items-center justify-content-center"
                    style={{ 
                      width: '70px', 
                      height: '70px', 
                      borderRadius: '16px',
                      fontSize: '2rem'
                    }}
                  >
                    📱
                  </div>
                </motion.div>
                <h5 className="text-info mb-3 fw-bold">{t(lang, 'about.contact_social')}</h5>
                <motion.a
                  href="https://instagram.com/is.lab.filkom"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-info text-dark fw-semibold mb-2"
                  style={{ borderRadius: '10px', width: '100%' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  @is.lab.filkom
                </motion.a>
                <p className="small text-white-50 mb-0">
                  Follow untuk update terbaru!
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
