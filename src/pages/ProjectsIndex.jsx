// src/pages/ProjectsIndex.jsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getProjects, getProjectCategories } from "../lib/apiProjects";
import { asAbsolute } from "../lib/http";
import { useLanguage } from "../contexts/LanguageContext";
import { t } from "../translations/translations";

export default function ProjectsIndex() {
  const { lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  
  const page = Number(searchParams.get("page") || 1);
  const category = searchParams.get("category") || "";
  const year = searchParams.get("year") || "";
  const q = searchParams.get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(q);
  const [meta, setMeta] = useState({ count: 0, totalPages: 1 });
  
  const perPage = 12;

  // Load categories
  useEffect(() => {
    (async () => {
      try {
        const res = await getProjectCategories();
        setCategories(res.data || []);
      } catch (e) {
        console.error("Failed to load categories:", e);
      }
    })();
  }, []);

  // Load projects
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getProjects({ page, perPage, category, year, q });
        setProjects(res.data || []);
        setMeta({ count: res.count, totalPages: res.totalPages });
        setErr("");
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, category, year, q]);

  const updateFilter = (key, value) => {
    const params = { category, year, q };
    params[key] = value;
    params.page = "1"; // Reset to page 1
    
    Object.keys(params).forEach(k => !params[k] && delete params[k]);
    setSearchParams(params);
  };

  const onSearch = (e) => {
    e.preventDefault();
    updateFilter("q", searchQuery);
  };

  const goToPage = (p) => {
    const params = { category, year, q, page: String(p) };
    Object.keys(params).forEach(k => !params[k] && delete params[k]);
    setSearchParams(params);
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
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
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
            <span className="badge bg-info text-dark px-4 py-2" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
              🚀 PROJECTS & PRODUCTS
            </span>
          </motion.div>
          
          <h2 className="section-title mb-3" style={{ fontSize: '2.5rem' }}>
            {lang === 'ID' ? 'Produk &' : 'Products &'} <span className="text-info">{lang === 'ID' ? 'Proyek' : 'Projects'}</span>
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
            {lang === 'ID' ? 'Hasil karya dan penelitian dari Lab Sistem Cerdas' : 'Creations and research from Intelligent Systems Lab'}
          </motion.p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div 
            className="p-4 rounded-4"
            style={{ 
              background: 'rgba(23, 162, 184, 0.05)',
              border: '1px solid rgba(23, 162, 184, 0.2)'
            }}
          >
            {/* Search Bar */}
            <form onSubmit={onSearch} className="mb-3">
              <div className="row g-3">
                <div className="col-md-8">
                  <label className="small text-info mb-2 d-block fw-semibold">🔍 {lang === 'ID' ? 'Cari Proyek' : 'Search Projects'}</label>
                  <motion.input
                    className="form-control bg-dark text-light border-secondary"
                    style={{ borderRadius: '10px' }}
                    placeholder={lang === 'ID' ? "Cari judul, deskripsi, atau tags..." : "Search title, description, or tags..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    whileFocus={{ scale: 1.01, borderColor: '#17a2b8' }}
                  />
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <motion.button 
                    type="submit"
                    className="btn btn-info text-dark fw-semibold w-100"
                    style={{ borderRadius: '10px' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {lang === 'ID' ? 'Cari' : 'Search'}
                  </motion.button>
                </div>
              </div>
            </form>

            {/* Category Filter */}
            <div>
              <label className="small text-info mb-2 d-block fw-semibold">📁 {lang === 'ID' ? 'Kategori' : 'Category'}</label>
              <div className="d-flex flex-wrap gap-2">
                <motion.button
                  type="button"
                  className={`btn ${!category ? "btn-info text-dark" : "btn-outline-info"}`}
                  style={{ borderRadius: '8px' }}
                  onClick={() => updateFilter("category", "")}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {lang === 'ID' ? 'Semua' : 'All'}
                </motion.button>
                
                {categories.map((cat) => (
                  <motion.button
                    key={cat.slug}
                    type="button"
                    className={`btn ${category === cat.name ? "btn-info text-dark" : "btn-outline-info"}`}
                    style={{ borderRadius: '8px' }}
                    onClick={() => updateFilter("category", cat.name)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {cat.icon} {cat.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Active Filters */}
            {(category || year || q) && (
              <motion.div 
                className="mt-3 p-3 rounded"
                style={{ background: 'rgba(23, 162, 184, 0.1)' }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <small className="text-info fw-semibold">
                  {lang === 'ID' ? 'Filter aktif:' : 'Active filters:'} 
                </small>
                <span className="text-white ms-2">{meta.count} {lang === 'ID' ? 'hasil' : 'results'}</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
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
              <div className="spinner-border text-info" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </motion.div>
            <p className="text-white-50 mt-3">{lang === 'ID' ? 'Memuat proyek...' : 'Loading projects...'}</p>
          </motion.div>
        )}

        {/* Error State */}
        {err && (
          <motion.div 
            className="alert alert-danger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {err}
          </motion.div>
        )}

        {/* Projects Grid */}
        {!loading && !err && (
          <AnimatePresence mode="wait">
            <motion.div 
              className="row"
              key={page}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {projects.map((project, index) => (
                <motion.div 
                  className="col-md-6 col-lg-4 mb-4" 
                  key={project.slug}
                  variants={cardVariant}
                  custom={index}
                >
                  <motion.div 
                    className="card card-dark h-100"
                    style={{ 
                      borderRadius: '16px',
                      border: '1px solid rgba(23, 162, 184, 0.3)',
                      background: 'rgba(23, 162, 184, 0.05)',
                      overflow: 'hidden'
                    }}
                    whileHover={{ 
                      y: -10,
                      boxShadow: '0 20px 40px rgba(23, 162, 184, 0.2)',
                      borderColor: 'rgba(23, 162, 184, 0.5)',
                      transition: { duration: 0.3 }
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
                      {project.thumbnail_url ? (
                        <motion.img
                          src={asAbsolute(project.thumbnail_url)}
                          alt={project.title}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                      ) : (
                        <div 
                          className="w-100 h-100 d-flex align-items-center justify-content-center"
                          style={{ background: 'rgba(23, 162, 184, 0.1)' }}
                        >
                          <span style={{ fontSize: '3rem' }}>🚀</span>
                        </div>
                      )}
                      
                      {/* Featured Badge */}
                      {project.is_featured && (
                        <span 
                          className="badge bg-warning text-dark position-absolute"
                          style={{ top: '10px', right: '10px', fontSize: '0.75rem' }}
                        >
                          ⭐ Featured
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="card-body d-flex flex-column">
                      {/* Category Badge */}
                      <div className="mb-2">
                        <span className="badge bg-info text-dark" style={{ fontSize: '0.7rem' }}>
                          {project.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h5 className="text-light mb-2" style={{ fontSize: '1.1rem', lineHeight: '1.4' }}>
                        {project.title}
                      </h5>

                      {/* Description */}
                      <p 
                        className="text-white-80 small mb-3 flex-grow-1"
                        style={{ 
                          lineHeight: '1.6',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {project.short_description}
                      </p>

                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="mb-3 d-flex flex-wrap gap-1">
                          {project.tags.slice(0, 3).map((tag, i) => (
                            <span 
                              key={i}
                              className="badge bg-dark text-info"
                              style={{ fontSize: '0.65rem' }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="d-flex gap-2 mt-auto">
                        <motion.div 
                          className="flex-grow-1"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Link 
                            to={`/projects/${project.slug}`}
                            className="btn btn-info text-dark btn-sm w-100"
                            style={{ borderRadius: '8px' }}
                          >
                            {lang === 'ID' ? '📖 Detail' : '📖 Details'}
                          </Link>
                        </motion.div>
                        {project.demo_url && (
                          <motion.a
                            href={project.demo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline-info btn-sm"
                            style={{ borderRadius: '8px' }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            🔗
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}

              {/* Empty State */}
              {projects.length === 0 && (
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
                    <div style={{ fontSize: '4rem' }}>🔍</div>
                    <h5 className="text-white-50 mt-3">
                      {lang === 'ID' ? 'Tidak ada proyek ditemukan' : 'No projects found'}
                    </h5>
                    <p className="text-white-50 small">
                      {lang === 'ID' ? 'Coba ubah filter atau kata kunci pencarian' : 'Try changing filters or search keywords'}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {!loading && meta.totalPages > 1 && (
          <motion.nav 
            className="mt-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ul className="pagination justify-content-center">
              <motion.li 
                className={`page-item ${page === 1 ? "disabled" : ""}`}
                whileHover={page !== 1 ? { scale: 1.05 } : {}}
              >
                <button 
                  className="page-link bg-dark text-info border-secondary"
                  onClick={() => goToPage(page - 1)}
                  style={{ borderRadius: '8px 0 0 8px' }}
                >
                  ← {lang === 'ID' ? 'Prev' : 'Previous'}
                </button>
              </motion.li>
              
              {[...Array(meta.totalPages)].map((_, i) => (
                <motion.li 
                  key={i + 1}
                  className={`page-item ${page === i + 1 ? "active" : ""}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button 
                    className={`page-link ${page === i + 1 ? 'bg-info text-dark border-info' : 'bg-dark text-light border-secondary'}`}
                    onClick={() => goToPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </motion.li>
              ))}
              
              <motion.li 
                className={`page-item ${page === meta.totalPages ? "disabled" : ""}`}
                whileHover={page !== meta.totalPages ? { scale: 1.05 } : {}}
              >
                <button 
                  className="page-link bg-dark text-info border-secondary"
                  onClick={() => goToPage(page + 1)}
                  style={{ borderRadius: '0 8px 8px 0' }}
                >
                  {lang === 'ID' ? 'Next' : 'Next'} →
                </button>
              </motion.li>
            </ul>
          </motion.nav>
        )}
      </div>
    </section>
  );
}
