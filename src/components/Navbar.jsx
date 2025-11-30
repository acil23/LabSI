import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logoIS from "../../public/assets/logo/logo_IS.jpg";
import { useLanguage } from "../contexts/LanguageContext";
import { t } from "../translations/translations";

function Navbar() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <motion.div 
          className="d-flex align-items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img
            src={logoIS}
            className="rounded-3"
            alt="Logo"
            style={{ height: "40px", marginRight: "10px" }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          />
          <Link className="navbar-brand fw-bold" to="/">
            Lab Sistem Cerdas
          </Link>
        </motion.div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <motion.ul 
            className="navbar-nav ms-auto align-items-lg-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.li 
              className="nav-item"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Link className="nav-link" to="/">
                {t(lang, 'nav.home')}
              </Link>
            </motion.li>
            <motion.li 
              className="nav-item"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Link className="nav-link" to="/anggota">
                {t(lang, 'nav.members')}
              </Link>
            </motion.li>
            <motion.li 
              className="nav-item"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Link className="nav-link" to="/jurnal">
                {t(lang, 'nav.publications')}
              </Link>
            </motion.li>
            <motion.li 
              className="nav-item"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Link className="nav-link" to="/berita">
                {t(lang, 'nav.news')}
              </Link>
            </motion.li>
            <motion.li 
              className="nav-item"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Link className="nav-link" to="/projects">
                {t(lang, 'nav.projects')}
              </Link>
            </motion.li>
            <motion.li 
              className="nav-item"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Link className="nav-link" to="/about">
                {t(lang, 'nav.about')}
              </Link>
            </motion.li>

            {/* Language Toggle Switch */}
            <li className="nav-item ms-lg-3">
              <motion.div
                className="d-flex align-items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span className="text-white-50 small d-none d-lg-inline">🌐</span>
                <div
                  onClick={toggleLanguage}
                  style={{
                    position: 'relative',
                    width: '70px',
                    height: '32px',
                    background: 'rgba(23, 162, 184, 0.2)',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    border: '2px solid rgba(23, 162, 184, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px'
                  }}
                >
                  {/* Background highlight */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      width: '32px',
                      height: '26px',
                      background: '#17a2b8',
                      borderRadius: '13px',
                      boxShadow: '0 2px 8px rgba(23, 162, 184, 0.4)'
                    }}
                    animate={{
                      x: lang === "ID" ? 2 : 34
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />

                  {/* Labels */}
                  <div style={{
                    position: 'relative',
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    padding: '0 6px',
                    zIndex: 1
                  }}>
                    <motion.span
                      style={{
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: lang === "ID" ? '#000' : '#fff',
                        transition: 'color 0.3s'
                      }}
                      animate={{
                        scale: lang === "ID" ? 1.1 : 1
                      }}
                    >
                      ID
                    </motion.span>
                    <motion.span
                      style={{
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: lang === "EN" ? '#000' : '#fff',
                        transition: 'color 0.3s'
                      }}
                      animate={{
                        scale: lang === "EN" ? 1.1 : 1
                      }}
                    >
                      EN
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            </li>
          </motion.ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
