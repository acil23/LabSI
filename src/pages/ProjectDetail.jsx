// src/pages/ProjectDetail.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  FileText, 
  Video, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle2,
  Code2,
  Lightbulb
} from 'lucide-react';

// Import API function & utilities
import { getProjectBySlug } from '../lib/apiProjects';
import { asAbsolute } from '../lib/http';
import { useLanguage } from '../contexts/LanguageContext';

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    loadProject();
  }, [slug]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjectBySlug(slug);
      
      // Parse JSON fields if they're strings (MySQL returns JSON as string)
      if (typeof data.metadata === 'string') {
        data.metadata = JSON.parse(data.metadata);
      }
      if (typeof data.gallery === 'string') {
        data.gallery = JSON.parse(data.gallery);
      }
      if (typeof data.features === 'string') {
        data.features = JSON.parse(data.features);
      }
      if (typeof data.tags === 'string') {
        data.tags = JSON.parse(data.tags);
      }
      if (typeof data.content_blocks === 'string') {
        data.content_blocks = JSON.parse(data.content_blocks);
      }
      
      setProject(data);
    } catch (err) {
      setError(err.message || (lang === 'ID' ? 'Gagal memuat project' : 'Failed to load project'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="section section-dark">
        <div className="container">
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
            <p className="text-white-50 mt-3">{lang === 'ID' ? 'Memuat project...' : 'Loading project...'}</p>
          </motion.div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section section-dark">
        <div className="container">
          <motion.div 
            className="text-center py-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ fontSize: '4rem' }}>⚠️</div>
            <h3 className="text-danger mb-3">{lang === 'ID' ? 'Error' : 'Error'}</h3>
            <p className="text-white-50 mb-4">{error}</p>
            <motion.button 
              onClick={() => navigate('/projects')} 
              className="btn btn-info text-dark"
              style={{ borderRadius: '10px' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={18} className="me-2" />
              {lang === 'ID' ? 'Kembali ke Daftar Project' : 'Back to Projects'}
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }

  if (!project) return null;

  const metadata = project.metadata || {};
  const gallery = project.gallery || [];
  const contentBlocks = project.content_blocks || [];
  const features = project.features || [];
  const tags = project.tags || [];

  return (
    <section className="section section-dark">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="position-relative"
        style={{ height: '60vh', minHeight: '400px', marginTop: '-2rem' }}
      >
        <div 
          className="position-absolute w-100 h-100"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(${asAbsolute(project.banner_url || project.thumbnail_url)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="position-relative container h-100 d-flex flex-column justify-content-end pb-5">
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => navigate('/projects')}
            className="btn btn-outline-info mb-4 align-self-start"
            style={{ borderRadius: '10px' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={18} className="me-2" />
            {lang === 'ID' ? 'Kembali' : 'Back'}
          </motion.button>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="badge bg-info text-dark mb-3 px-3 py-2" style={{ fontSize: '0.9rem' }}>
              {project.category}
            </span>
            
            <h1 className="display-4 fw-bold mb-3 text-light">{project.title}</h1>
            
            <p className="lead text-white-80 mb-4" style={{ maxWidth: '800px' }}>
              {project.short_description}
            </p>

            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className="badge bg-dark text-info border border-info px-3 py-2">
                <Calendar size={14} className="me-2" />
                {project.year}
              </span>
              
              <span className="badge bg-dark text-info border border-info px-3 py-2">
                {project.status === 'completed' ? '✅ ' + (lang === 'ID' ? 'Selesai' : 'Completed') : 
                 project.status === 'ongoing' ? '🚧 ' + (lang === 'ID' ? 'Berlangsung' : 'Ongoing') : 
                 '📦 ' + project.status}
              </span>

              {project.is_featured && (
                <span className="badge bg-warning text-dark px-3 py-2">
                  ⭐ Featured
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="container py-5">
        <div className="row g-4">
          {/* Main Content */}
          <div className="col-lg-8">
            {/* Description */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-5"
            >
              <h2 className="h3 mb-4 text-info">
                📝 {lang === 'ID' ? 'Tentang Project' : 'About Project'}
              </h2>
              <div 
                className="text-white-80 lh-lg"
                style={{ fontSize: '1.05rem' }}
                dangerouslySetInnerHTML={{ 
                  __html: project.full_description?.replace(/\n/g, '<br>') || project.short_description 
                }}
              />
            </motion.div>

            {/* Features */}
            {features.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-5"
              >
                <h2 className="h3 mb-4 text-info">
                  ✨ {lang === 'ID' ? 'Fitur Utama' : 'Key Features'}
                </h2>
                <div className="row g-3">
                  {features.map((feature, idx) => (
                    <div key={idx} className="col-md-6">
                      <motion.div 
                        className="p-3 h-100"
                        style={{
                          background: 'rgba(23, 162, 184, 0.05)',
                          border: '1px solid rgba(23, 162, 184, 0.3)',
                          borderRadius: '12px'
                        }}
                        whileHover={{ 
                          borderColor: 'rgba(23, 162, 184, 0.5)',
                          background: 'rgba(23, 162, 184, 0.08)'
                        }}
                      >
                        <CheckCircle2 size={20} className="text-info me-2" />
                        <span className="text-light">{feature}</span>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-5"
              >
                <h2 className="h3 mb-4 text-info">
                  🖼️ {lang === 'ID' ? 'Galeri' : 'Gallery'}
                </h2>
                <div className="row g-3">
                  {gallery.map((item, idx) => (
                    <div key={idx} className="col-md-4">
                      <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="position-relative overflow-hidden"
                        style={{
                          borderRadius: '12px',
                          cursor: 'pointer',
                          aspectRatio: '16/9',
                          border: '1px solid rgba(23, 162, 184, 0.3)'
                        }}
                        onClick={() => setLightboxImage(item)}
                      >
                        <img 
                          src={asAbsolute(item.url)} 
                          alt={item.caption || `Gallery ${idx + 1}`}
                          className="w-100 h-100 object-fit-cover"
                        />
                        {item.caption && (
                          <div 
                            className="position-absolute bottom-0 w-100 p-2 text-center text-light"
                            style={{
                              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                              fontSize: '0.85rem'
                            }}
                          >
                            {item.caption}
                          </div>
                        )}
                      </motion.div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Content Blocks */}
            {contentBlocks.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-5"
              >
                {contentBlocks.map((block, idx) => (
                  <motion.div 
                    key={idx} 
                    className="mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                  >
                    {block.type === 'text' && (
                      <div className="text-white-80 lh-lg" style={{ fontSize: '1.05rem' }}>
                        {block.content}
                      </div>
                    )}
                    
                    {block.type === 'image' && (
                      <div className="text-center">
                        <img 
                          src={asAbsolute(block.content)} 
                          alt={`Content ${idx}`}
                          className="img-fluid rounded"
                          style={{ 
                            maxHeight: '500px',
                            border: '1px solid rgba(23, 162, 184, 0.3)'
                          }}
                        />
                      </div>
                    )}
                    
                    {block.type === 'video' && (
                      <div className="ratio ratio-16x9">
                        <iframe 
                          src={block.content}
                          allowFullScreen
                          className="rounded"
                          style={{ border: '1px solid rgba(23, 162, 184, 0.3)' }}
                        />
                      </div>
                    )}

                    {block.type === 'code' && (
                      <pre 
                        className="p-3 rounded text-light"
                        style={{ 
                          background: 'rgba(23, 162, 184, 0.1)',
                          border: '1px solid rgba(23, 162, 184, 0.3)',
                          overflowX: 'auto'
                        }}
                      >
                        <code>{block.content}</code>
                      </pre>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mb-5"
              >
                <h5 className="text-info mb-3">
                  🏷️ Tags
                </h5>
                <div className="d-flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="badge bg-dark text-info border border-info px-3 py-2"
                      style={{ fontSize: '0.85rem' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: '2rem' }}>
              {/* Quick Links */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="p-4 mb-4"
                style={{
                  background: 'rgba(23, 162, 184, 0.05)',
                  border: '1px solid rgba(23, 162, 184, 0.3)',
                  borderRadius: '16px'
                }}
              >
                <h5 className="mb-4 text-info">
                  🔗 {lang === 'ID' ? 'Tautan Cepat' : 'Quick Links'}
                </h5>
                
                <div className="d-flex flex-column gap-2">
                  {project.demo_url && (
                    <motion.a 
                      href={project.demo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-info text-dark w-100"
                      style={{ borderRadius: '10px' }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <ExternalLink size={18} className="me-2" />
                      Live Demo
                    </motion.a>
                  )}
                  
                  {project.repo_url && (
                    <motion.a 
                      href={project.repo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-outline-info w-100"
                      style={{ borderRadius: '10px' }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Github size={18} className="me-2" />
                      Repository
                    </motion.a>
                  )}
                  
                  {project.paper_url && (
                    <motion.a 
                      href={project.paper_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-outline-info w-100"
                      style={{ borderRadius: '10px' }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <FileText size={18} className="me-2" />
                      Paper/Docs
                    </motion.a>
                  )}
                  
                  {project.video_url && (
                    <motion.a 
                      href={project.video_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-outline-info w-100"
                      style={{ borderRadius: '10px' }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Video size={18} className="me-2" />
                      Video Demo
                    </motion.a>
                  )}
                </div>
              </motion.div>

              {/* Tech Stack */}
              {metadata.tech_stack && metadata.tech_stack.length > 0 && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="p-4 mb-4"
                  style={{
                    background: 'rgba(23, 162, 184, 0.05)',
                    border: '1px solid rgba(23, 162, 184, 0.3)',
                    borderRadius: '16px'
                  }}
                >
                  <h5 className="mb-3 text-info">
                    <Code2 size={20} className="me-2" />
                    Tech Stack
                  </h5>
                  <div className="d-flex flex-wrap gap-2">
                    {metadata.tech_stack.map((tech, idx) => (
                      <span 
                        key={idx}
                        className="badge bg-dark text-info border border-info px-3 py-2"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Project Info */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="p-4 mb-4"
                style={{
                  background: 'rgba(23, 162, 184, 0.05)',
                  border: '1px solid rgba(23, 162, 184, 0.3)',
                  borderRadius: '16px'
                }}
              >
                <h5 className="mb-3 text-info">
                  ℹ️ {lang === 'ID' ? 'Informasi' : 'Information'}
                </h5>
                
                {metadata.team && (
                  <div className="mb-3">
                    <div className="text-muted small mb-1">
                      <Users size={16} className="me-2" />
                      {lang === 'ID' ? 'Tim' : 'Team'}
                    </div>
                    <div className="text-light">
                      {Array.isArray(metadata.team) ? metadata.team.join(', ') : metadata.team}
                    </div>
                  </div>
                )}

                {metadata.duration && (
                  <div className="mb-3">
                    <div className="text-muted small mb-1">
                      <Clock size={16} className="me-2" />
                      {lang === 'ID' ? 'Durasi' : 'Duration'}
                    </div>
                    <div className="text-light">{metadata.duration}</div>
                  </div>
                )}

                {metadata.client && (
                  <div className="mb-3">
                    <div className="text-muted small mb-1">
                      <Lightbulb size={16} className="me-2" />
                      {lang === 'ID' ? 'Klien/Pendanaan' : 'Client/Funding'}
                    </div>
                    <div className="text-light">{metadata.client}</div>
                  </div>
                )}

                <div className="mb-0">
                  <div className="text-muted small mb-1">
                    <Calendar size={16} className="me-2" />
                    {lang === 'ID' ? 'Tanggal' : 'Date'}
                  </div>
                  <div className="text-light">
                    {new Date(project.project_date).toLocaleDateString(lang === 'ID' ? 'id-ID' : 'en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </motion.div>

              {/* QR Code */}
              {project.qr_code_url && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="p-4 text-center"
                  style={{
                    background: 'rgba(23, 162, 184, 0.05)',
                    border: '1px solid rgba(23, 162, 184, 0.3)',
                    borderRadius: '16px'
                  }}
                >
                  <h5 className="mb-3 text-info">
                    📱 {lang === 'ID' ? 'Scan QR' : 'Scan QR'}
                  </h5>
                  <img 
                    src={asAbsolute(project.qr_code_url)} 
                    alt="QR Code"
                    className="img-fluid"
                    style={{ maxWidth: '200px', borderRadius: '8px' }}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background: 'rgba(0,0,0,0.9)',
            zIndex: 9999,
            cursor: 'pointer'
          }}
          onClick={() => setLightboxImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center"
            style={{ maxWidth: '90vw', maxHeight: '90vh' }}
          >
            <img
              src={asAbsolute(lightboxImage.url)}
              alt={lightboxImage.caption}
              className="img-fluid rounded"
              style={{ maxHeight: '85vh' }}
            />
            {lightboxImage.caption && (
              <div className="mt-3 text-light">
                {lightboxImage.caption}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
