// src/pages/admin/ProjectsAdminList.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Eye,
  Star,
  Calendar,
  ExternalLink,
  Github,
  FileText
} from 'lucide-react';

import { adminListProjects, adminDeleteProject } from '../../lib/apiProjects';
import { asAbsolute } from '../../lib/http';

export default function ProjectsAdminList() {
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ count: 0, totalPages: 1 });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const perPage = 20;

  useEffect(() => {
    loadProjects();
  }, [page, searchQuery]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminListProjects({ page, perPage, q: searchQuery });
      
      // Parse JSON fields if needed
      const parsedData = res.data.map(project => ({
        ...project,
        tags: typeof project.tags === 'string' ? JSON.parse(project.tags) : project.tags,
        features: typeof project.features === 'string' ? JSON.parse(project.features) : project.features,
      }));
      
      setProjects(parsedData);
      setMeta({ count: res.count, totalPages: Math.ceil(res.count / perPage) });
    } catch (err) {
      setError(err.message || 'Gagal memuat projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadProjects();
  };

  const handleDelete = async (slug) => {
    if (!deleteConfirm || deleteConfirm !== slug) {
      setDeleteConfirm(slug);
      return;
    }

    try {
      setDeleting(true);
      await adminDeleteProject(slug);
      setDeleteConfirm(null);
      loadProjects();
    } catch (err) {
      alert('Gagal menghapus project: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      ongoing: { bg: 'warning', text: 'dark', icon: '🚧', label: 'Berlangsung' },
      completed: { bg: 'success', text: 'white', icon: '✅', label: 'Selesai' },
      published: { bg: 'info', text: 'dark', icon: '📦', label: 'Published' },
      archived: { bg: 'secondary', text: 'white', icon: '📁', label: 'Archived' }
    };
    
    const badge = badges[status] || badges.published;
    
    return (
      <span className={`badge bg-${badge.bg} text-${badge.text}`}>
        {badge.icon} {badge.label}
      </span>
    );
  };

  return (
    <div className="container-fluid py-4" style={{ background: '#0a0e27', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h2 className="text-light mb-1">🚀 Projects Management</h2>
            <p className="text-white-50 mb-0">Kelola produk & proyek lab</p>
          </div>
          
          <motion.button
            onClick={() => navigate('/admin/projects/new')}
            className="btn btn-info text-dark fw-semibold"
            style={{ borderRadius: '10px' }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={18} className="me-2" />
            Tambah Project Baru
          </motion.button>
        </div>
      </motion.div>

      {/* Search & Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4"
      >
        <div 
          className="p-4 rounded-4"
          style={{
            background: 'rgba(23, 162, 184, 0.05)',
            border: '1px solid rgba(23, 162, 184, 0.2)'
          }}
        >
          <div className="row g-3">
            {/* Search */}
            <div className="col-md-8">
              <form onSubmit={handleSearch}>
                <div className="input-group">
                  <span 
                    className="input-group-text bg-dark border-secondary"
                    style={{ borderRadius: '10px 0 0 10px' }}
                  >
                    <Search size={18} className="text-info" />
                  </span>
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary"
                    placeholder="Cari judul atau deskripsi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ borderRadius: '0 10px 10px 0' }}
                  />
                </div>
              </form>
            </div>

            {/* Stats */}
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-md-end h-100">
                <div className="text-center px-3">
                  <div className="h4 mb-0 text-info">{meta.count}</div>
                  <small className="text-white-50">Total Projects</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div 
          className="text-center py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="spinner-border text-info mb-3" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-white-50">Memuat projects...</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div 
          className="alert alert-danger"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ⚠️ {error}
        </motion.div>
      )}

      {/* Projects Table */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div 
            className="rounded-4 overflow-hidden"
            style={{
              background: 'rgba(23, 162, 184, 0.05)',
              border: '1px solid rgba(23, 162, 184, 0.2)'
            }}
          >
            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0">
                <thead style={{ background: 'rgba(23, 162, 184, 0.1)' }}>
                  <tr>
                    <th style={{ width: '80px' }}>Thumbnail</th>
                    <th>Title</th>
                    <th style={{ width: '120px' }}>Category</th>
                    <th style={{ width: '120px' }}>Status</th>
                    <th style={{ width: '100px' }}>Year</th>
                    <th style={{ width: '80px' }} className="text-center">Featured</th>
                    <th style={{ width: '80px' }} className="text-center">Published</th>
                    <th style={{ width: '120px' }}>Links</th>
                    <th style={{ width: '180px' }} className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="wait">
                    {projects.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center py-5">
                          <div className="text-white-50">
                            <div style={{ fontSize: '3rem' }}>📭</div>
                            <p className="mb-0 mt-3">Tidak ada projects ditemukan</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      projects.map((project, index) => (
                        <motion.tr
                          key={project.slug}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ 
                            backgroundColor: 'rgba(23, 162, 184, 0.08)',
                            transition: { duration: 0.2 }
                          }}
                        >
                          {/* Thumbnail */}
                          <td>
                            <div 
                              className="rounded overflow-hidden"
                              style={{ 
                                width: '60px', 
                                height: '60px',
                                border: '1px solid rgba(23, 162, 184, 0.3)'
                              }}
                            >
                              {project.thumbnail_url ? (
                                <img 
                                  src={asAbsolute(project.thumbnail_url)} 
                                  alt={project.title}
                                  className="w-100 h-100 object-fit-cover"
                                />
                              ) : (
                                <div 
                                  className="w-100 h-100 d-flex align-items-center justify-content-center"
                                  style={{ background: 'rgba(23, 162, 184, 0.1)' }}
                                >
                                  <span>🚀</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Title */}
                          <td>
                            <div className="text-light fw-semibold mb-1">
                              {project.title}
                            </div>
                            <small className="text-white-50 d-block" style={{ 
                              maxWidth: '300px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {project.short_description}
                            </small>
                          </td>

                          {/* Category */}
                          <td>
                            <span className="badge bg-info text-dark">
                              {project.category || 'N/A'}
                            </span>
                          </td>

                          {/* Status */}
                          <td>
                            {getStatusBadge(project.status)}
                          </td>

                          {/* Year */}
                          <td>
                            <span className="text-white-50">
                              <Calendar size={14} className="me-1" />
                              {project.year || 'N/A'}
                            </span>
                          </td>

                          {/* Featured */}
                          <td className="text-center">
                            {project.is_featured ? (
                              <Star size={18} className="text-warning" fill="currentColor" />
                            ) : (
                              <span className="text-white-50">-</span>
                            )}
                          </td>

                          {/* Published */}
                          <td className="text-center">
                            {project.is_published ? (
                              <span className="text-success">✓</span>
                            ) : (
                              <span className="text-danger">✗</span>
                            )}
                          </td>

                          {/* Links */}
                          <td>
                            <div className="d-flex gap-1">
                              {project.demo_url && (
                                <a 
                                  href={project.demo_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-info"
                                  style={{ borderRadius: '6px', padding: '4px 8px' }}
                                  title="Demo"
                                >
                                  <ExternalLink size={14} />
                                </a>
                              )}
                              {project.repo_url && (
                                <a 
                                  href={project.repo_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-info"
                                  style={{ borderRadius: '6px', padding: '4px 8px' }}
                                  title="Repository"
                                >
                                  <Github size={14} />
                                </a>
                              )}
                              {project.paper_url && (
                                <a 
                                  href={project.paper_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-info"
                                  style={{ borderRadius: '6px', padding: '4px 8px' }}
                                  title="Paper"
                                >
                                  <FileText size={14} />
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              {/* View */}
                              <motion.button
                                onClick={() => window.open(`/projects/${project.slug}`, '_blank')}
                                className="btn btn-sm btn-outline-info"
                                style={{ borderRadius: '8px' }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="View"
                              >
                                <Eye size={16} />
                              </motion.button>

                              {/* Edit */}
                              <motion.button
                                onClick={() => navigate(`/admin/projects/${project.slug}/edit`)}
                                className="btn btn-sm btn-info text-dark"
                                style={{ borderRadius: '8px' }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </motion.button>

                              {/* Delete */}
                              <motion.button
                                onClick={() => handleDelete(project.slug)}
                                className={`btn btn-sm ${deleteConfirm === project.slug ? 'btn-danger' : 'btn-outline-danger'}`}
                                style={{ borderRadius: '8px' }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={deleting}
                                title={deleteConfirm === project.slug ? 'Click again to confirm' : 'Delete'}
                              >
                                {deleting && deleteConfirm === project.slug ? (
                                  <span className="spinner-border spinner-border-sm" />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pagination */}
      {!loading && meta.totalPages > 1 && (
        <motion.nav 
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link bg-dark text-info border-secondary"
                onClick={() => setPage(page - 1)}
                style={{ borderRadius: '8px 0 0 8px' }}
              >
                ← Previous
              </button>
            </li>
            
            {[...Array(meta.totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // Show first, last, current, and adjacent pages
              if (
                pageNum === 1 ||
                pageNum === meta.totalPages ||
                Math.abs(pageNum - page) <= 1
              ) {
                return (
                  <motion.li 
                    key={pageNum}
                    className={`page-item ${page === pageNum ? 'active' : ''}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button 
                      className={`page-link ${page === pageNum ? 'bg-info text-dark border-info' : 'bg-dark text-light border-secondary'}`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  </motion.li>
                );
              } else if (pageNum === page - 2 || pageNum === page + 2) {
                return (
                  <li key={pageNum} className="page-item disabled">
                    <span className="page-link bg-dark text-secondary border-secondary">...</span>
                  </li>
                );
              }
              return null;
            })}
            
            <li className={`page-item ${page === meta.totalPages ? 'disabled' : ''}`}>
              <button 
                className="page-link bg-dark text-info border-secondary"
                onClick={() => setPage(page + 1)}
                style={{ borderRadius: '0 8px 8px 0' }}
              >
                Next →
              </button>
            </li>
          </ul>
        </motion.nav>
      )}

      {/* Delete Confirmation Toast */}
      {deleteConfirm && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="position-fixed bottom-0 start-50 translate-middle-x mb-4"
          style={{ zIndex: 1050 }}
        >
          <div 
            className="alert alert-warning mb-0 d-flex align-items-center gap-3"
            style={{ 
              borderRadius: '12px',
              border: '2px solid #ffc107',
              minWidth: '300px'
            }}
          >
            <span>⚠️ Click delete again to confirm</span>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setDeleteConfirm(null)}
              style={{ borderRadius: '6px' }}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
