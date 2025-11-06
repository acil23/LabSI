import React from "react";
import { Link } from "react-router-dom";
import AdminGate from "../../components/adminGate";
import Layout from "../../components/Layout";
import { motion } from "framer-motion";

export default function AdminHome() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
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

  const adminCards = [
    {
      title: "Anggota",
      description: "Kelola data anggota (tambah, ubah, hapus).",
      icon: "👥",
      color: "#17a2b8",
      listLink: "/admin/anggota",
      addLink: "/admin/anggota/new",
      listText: "Lihat Daftar",
      addText: "Tambah Anggota"
    },
    {
      title: "Berita & Acara",
      description: "Kelola berita & agenda (tambah, ubah, hapus).",
      icon: "📰",
      color: "#17a2b8",
      listLink: "/admin/berita",
      addLink: "/admin/berita/new",
      listText: "Lihat Daftar",
      addText: "Tulis Berita"
    },
    {
      title: "Jurnal",
      description: "Kelola publikasi jurnal & konferensi.",
      icon: "📚",
      color: "#17a2b8",
      listLink: "/admin/jurnal",
      addLink: "/admin/jurnal/new",
      listText: "Lihat Daftar",
      addText: "Tambah Jurnal"
    },
    {
      title: "Collaborations",
      description: "Kelola kolaborasi (tambah, ubah, hapus).",
      icon: "🤝",
      color: "#17a2b8",
      listLink: "/admin/kolaborasi",
      addLink: "/admin/kolaborasi/new",
      listText: "Lihat Daftar",
      addText: "Tambah Kolaborasi"
    }
  ];

  return (
    <Layout>
      <AdminGate>
        <section className="section section-dark">
          <div className="container">
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
                <span className="badge bg-warning text-dark px-4 py-2" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
                  🔐 ADMIN PANEL
                </span>
              </motion.div>
              
              <h2 className="section-title mb-3" style={{ fontSize: '2.5rem' }}>
                Admin <span className="text-info">Dashboard</span>
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
                Kelola semua konten website dengan mudah
              </motion.p>
            </motion.div>

            {/* Cards Grid */}
            <motion.div 
              className="row g-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {adminCards.map((card, index) => (
                <motion.div 
                  className="col-md-6" 
                  key={index}
                  variants={fadeInUp}
                  custom={index}
                >
                  <motion.div 
                    className="card card-dark h-100 p-4"
                    style={{ 
                      borderRadius: '20px',
                      border: '1px solid rgba(23, 162, 184, 0.3)',
                      background: 'rgba(23, 162, 184, 0.05)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    whileHover={{ 
                      y: -10,
                      boxShadow: '0 20px 40px rgba(23, 162, 184, 0.2)',
                      borderColor: 'rgba(23, 162, 184, 0.5)',
                      transition: { duration: 0.3 }
                    }}
                  >
                    {/* Decorative element */}
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
                      transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                    />

                    <div className="d-flex align-items-start gap-3" style={{ position: 'relative', zIndex: 1 }}>
                      <motion.div
                        className="d-flex align-items-center justify-content-center"
                        style={{ 
                          width: 64, 
                          height: 64,
                          borderRadius: '16px',
                          background: `linear-gradient(135deg, ${card.color}30, ${card.color}10)`,
                          border: `2px solid ${card.color}50`,
                          fontSize: '2rem'
                        }}
                        whileHover={{ 
                          rotate: 360,
                          scale: 1.1
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        {card.icon}
                      </motion.div>
                      
                      <div className="flex-grow-1">
                        <h5 className="text-light mb-2" style={{ fontSize: '1.4rem' }}>
                          {card.title}
                        </h5>
                        <p className="text-white-80 mb-3" style={{ fontSize: '0.95rem' }}>
                          {card.description}
                        </p>
                        <div className="d-flex gap-2 flex-wrap">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Link
                              to={card.listLink}
                              className="btn btn-outline-info btn-sm"
                              style={{ borderRadius: '10px' }}
                            >
                              {card.listText}
                            </Link>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Link
                              to={card.addLink}
                              className="btn btn-info btn-sm text-dark"
                              style={{ borderRadius: '10px' }}
                            >
                              + {card.addText}
                            </Link>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick Stats (Optional) */}
            <motion.div
              className="mt-5 p-4"
              style={{ 
                borderRadius: '20px',
                background: 'rgba(23, 162, 184, 0.05)',
                border: '1px solid rgba(23, 162, 184, 0.2)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="row text-center g-4">
                <div className="col-md-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                  >
                    <h3 className="text-info mb-1">✨</h3>
                    <p className="text-white-50 small mb-0">Selamat datang di panel admin</p>
                  </motion.div>
                </div>
                <div className="col-md-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                  >
                    <h3 className="text-info mb-1">🚀</h3>
                    <p className="text-white-50 small mb-0">Kelola konten dengan mudah</p>
                  </motion.div>
                </div>
                <div className="col-md-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                  >
                    <h3 className="text-info mb-1">⚡</h3>
                    <p className="text-white-50 small mb-0">Upload & update cepat</p>
                  </motion.div>
                </div>
                <div className="col-md-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                  >
                    <h3 className="text-info mb-1">🔒</h3>
                    <p className="text-white-50 small mb-0">Akses terlindungi</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </AdminGate>
    </Layout>
  );
}
