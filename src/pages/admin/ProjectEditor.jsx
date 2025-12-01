// src/pages/admin/ProjectEditor.jsx 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImageUpload from '../../components/ImageUpload';
import { 
  ArrowLeft, Save, X, Plus, Trash2, Upload, 
  Image as ImageIcon, Type, Video, Code, List,
  Eye, EyeOff 
} from 'lucide-react';

import { 
  getProjectBySlug, 
  adminCreateProject, 
  adminUpdateProject 
} from '../../lib/apiProjects';
import { getProjectCategories } from '../../lib/apiProjects';

export default function ProjectEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(slug);

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Categories
  const [categories, setCategories] = useState([]);

  // Form Data - Basic Info
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    category: '',
    status: 'ongoing',
    project_date: new Date().toISOString().split('T')[0],
    year: new Date().getFullYear(),
    
    // Images
    thumbnail_url: '',
    banner_url: '',
    qr_code_url: '',
    
    // Descriptions
    short_description: '',
    full_description: '',
    
    // Links
    demo_url: '',
    repo_url: '',
    paper_url: '',
    video_url: '',
    
    // Arrays (will be CSV input then converted to JSON)
    tags: [],
    features: [],
    
    // Metadata (object)
    metadata: {
      tech_stack: [],
      team: [],
      duration: '',
      client: ''
    },
    
    // Gallery (array of objects)
    gallery: [],
    
    // Content Blocks (array of objects)
    content_blocks: [],
    
    // Display Options
    is_featured: false,
    is_published: true,
    display_order: 0
  });

  // CSV input states (temporary before converting to array)
  const [tagsInput, setTagsInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [teamInput, setTeamInput] = useState('');

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  // Load project if editing
  useEffect(() => {
    if (isEdit && slug) {
      loadProject();
    }
  }, [isEdit, slug]);

  const loadCategories = async () => {
    try {
      const res = await getProjectCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await getProjectBySlug(slug);
      
      // 1. Helper untuk memastikan data selalu Array
      const parseArray = (val) => {
        if (!val) return []; // Jika null/undefined, kembalikan []
        if (typeof val === 'string') {
          try { return JSON.parse(val); } catch(e) { return []; }
        }
        return val;
      };

      // 2. Helper untuk memastikan data selalu Object
      const parseObj = (val) => {
        if (!val) return {}; 
        if (typeof val === 'string') {
          try { return JSON.parse(val); } catch(e) { return {}; }
        }
        return val;
      };
      
      // 3. Bersihkan data sebelum masuk state
      const cleanData = {
        ...data,
        // Pastikan field text tidak null
        short_description: data.short_description || '',
        full_description: data.full_description || '',
        
        // Pastikan field array/object diproses dengan aman
        metadata: parseObj(data.metadata),
        gallery: parseArray(data.gallery),
        features: parseArray(data.features),
        tags: parseArray(data.tags),
        content_blocks: parseArray(data.content_blocks),
      };
      
      setFormData(cleanData);
      
      // Set CSV inputs
      setTagsInput(cleanData.tags?.join(', ') || '');
      setFeaturesInput(cleanData.features?.join(', ') || '');
      setTechStackInput(cleanData.metadata?.tech_stack?.join(', ') || '');
      setTeamInput(cleanData.metadata?.team?.join(', ') || '');
      
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  // Handle basic input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle metadata change
  const handleMetadataChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [key]: value
      }
    }));
  };

  // Convert CSV to array
  const csvToArray = (csv) => {
    return csv
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  // Add Content Block
const addContentBlock = (type) => {
  const newBlock = {
    id: Date.now(), // unique ID
    type: type,
    content: ''
  };
  
  setFormData(prev => ({
    ...prev,
    content_blocks: [...prev.content_blocks, newBlock]
  }));
};

// Remove Content Block
const removeContentBlock = (id) => {
  setFormData(prev => ({
    ...prev,
    content_blocks: prev.content_blocks.filter(block => block.id !== id)
  }));
};

// Update Content Block
const updateContentBlock = (id, content) => {
  setFormData(prev => ({
    ...prev,
    content_blocks: prev.content_blocks.map(block => 
      block.id === id ? { ...block, content } : block
    )
  }));
};

// Move Content Block (reorder)
const moveContentBlock = (index, direction) => {
  const newBlocks = [...formData.content_blocks];
  
  if (direction === 'up' && index > 0) {
    [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
  } else if (direction === 'down' && index < newBlocks.length - 1) {
    [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
  }
  
  setFormData(prev => ({
    ...prev,
    content_blocks: newBlocks
  }));
};

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');

      // Prepare data
      const submitData = {
        ...formData,
        tags: csvToArray(tagsInput),
        features: csvToArray(featuresInput),
        metadata: {
          ...formData.metadata,
          tech_stack: csvToArray(techStackInput),
          team: csvToArray(teamInput)
        }
      };

      if (isEdit) {
        await adminUpdateProject(slug, submitData);
      } else {
        await adminCreateProject(submitData);
      }

      navigate('/admin/projects');
    } catch (err) {
      setError(err.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-white-50 mt-3">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="d-flex justify-content-between align-items-center mb-4"
      >
        <div>
          <h2 className="text-info mb-2">
            🚀 {isEdit ? 'Edit Project' : 'Add New Project'}
          </h2>
          <p className="text-white-50 mb-0">
            {isEdit ? `Editing: ${formData.title}` : 'Create a new project entry'}
          </p>
        </div>
        
        <motion.button
          onClick={() => navigate('/admin/projects')}
          className="btn btn-outline-info"
          style={{ borderRadius: '10px' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={18} className="me-2" />
          Back to List
        </motion.button>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert alert-danger"
        >
          {error}
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* BASIC INFO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card card-dark mb-4"
          style={{
            background: 'rgba(23, 162, 184, 0.05)',
            border: '1px solid rgba(23, 162, 184, 0.3)',
            borderRadius: '16px'
          }}
        >
          <div className="card-body p-4">
            <h5 className="text-info mb-4">📝 Basic Information</h5>
            
            <div className="row g-3">
              {/* Slug - only for new */}
              {!isEdit && (
                <div className="col-md-6">
                  <label className="form-label text-light">Slug *</label>
                  <input
                    type="text"
                    name="slug"
                    className="form-control bg-dark text-light border-secondary"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    placeholder="e.g., my-awesome-project"
                  />
                  <small className="text-muted">URL-friendly identifier</small>
                </div>
              )}

              {/* Title */}
              <div className={isEdit ? 'col-12' : 'col-md-6'}>
                <label className="form-label text-light">Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control bg-dark text-light border-secondary"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Project Title"
                />
              </div>

              {/* Category */}
              <div className="col-md-6">
                <label className="form-label text-light">Category</label>
                <select
                  name="category"
                  className="form-select bg-dark text-light border-secondary"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.slug} value={cat.name}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="col-md-6">
                <label className="form-label text-light">Status</label>
                <select
                  name="status"
                  className="form-select bg-dark text-light border-secondary"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="ongoing">🚧 Ongoing</option>
                  <option value="completed">✅ Completed</option>
                  <option value="published">📦 Published</option>
                  <option value="archived">📁 Archived</option>
                </select>
              </div>

              {/* Project Date */}
              <div className="col-md-6">
                <label className="form-label text-light">Project Date</label>
                <input
                  type="date"
                  name="project_date"
                  className="form-control bg-dark text-light border-secondary"
                  value={formData.project_date}
                  onChange={handleChange}
                />
              </div>

              {/* Year */}
              <div className="col-md-6">
                <label className="form-label text-light">Year</label>
                <input
                  type="number"
                  name="year"
                  className="form-control bg-dark text-light border-secondary"
                  value={formData.year}
                  onChange={handleChange}
                  min="2000"
                  max="2100"
                />
              </div>
            </div>
          </div>
        </motion.div>

        // ProjectEditor.jsx - PART 2 (tambahkan setelah Basic Info Section)

        {/* IMAGES SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card card-dark mb-4"
          style={{
            background: 'rgba(23, 162, 184, 0.05)',
            border: '1px solid rgba(23, 162, 184, 0.3)',
            borderRadius: '16px'
          }}
        >
          <div className="card-body p-4">
            <h5 className="text-info mb-4">🖼️ Images</h5>
            
            <div className="row g-3">
              {/* Thumbnail */}
                <div className="col-md-4">
                  <label className="form-label text-light">Thumbnail Image</label>
                  {/* Ganti input biasa dengan ImageUpload */}
                  <ImageUpload 
                    value={formData.thumbnail_url}
                    onChange={(url) => setFormData(prev => ({ ...prev, thumbnail_url: url }))}
                    placeholder="/uploads/projects/..."
                  />
                  
                  {formData.thumbnail_url && (
                    <div className="mt-2 position-relative">
                      <img 
                        src={formData.thumbnail_url} // Pastikan helper asAbsolute menghandle ini di Frontend view
                        alt="Thumbnail" 
                        className="img-fluid rounded"
                        style={{ maxHeight: '150px', objectFit: 'cover', width: '100%' }}
                      />
                    </div>
                  )}
                  <small className="text-muted">For card display (16:9)</small>
                </div>

                {/* Banner */}
                <div className="col-md-4">
                  <label className="form-label text-light">Banner Image</label>
                  <ImageUpload 
                    value={formData.banner_url}
                    onChange={(url) => setFormData(prev => ({ ...prev, banner_url: url }))}
                    placeholder="/uploads/projects/..."
                  />
                  {formData.banner_url && (
                    <div className="mt-2">
                      <img 
                        src={formData.banner_url} 
                        alt="Banner" 
                        className="img-fluid rounded"
                        style={{ maxHeight: '150px', objectFit: 'cover', width: '100%' }}
                      />
                    </div>
                  )}
                  <small className="text-muted">Hero section (wide)</small>
                </div>

                {/* QR Code */}
                <div className="col-md-4">
                  <label className="form-label text-light">QR Code</label>
                  <ImageUpload 
                    value={formData.qr_code_url}
                    onChange={(url) => setFormData(prev => ({ ...prev, qr_code_url: url }))}
                    placeholder="/uploads/projects/..."
                  />
                  {formData.qr_code_url && (
                    <div className="mt-2 text-center">
                      <img 
                        src={formData.qr_code_url} 
                        alt="QR" 
                        className="img-fluid rounded"
                        style={{ maxHeight: '150px' }}
                      />
                    </div>
                  )}
                </div>
            </div>
          </div>
        </motion.div>

        {/* DESCRIPTIONS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card card-dark mb-4"
          style={{
            background: 'rgba(23, 162, 184, 0.05)',
            border: '1px solid rgba(23, 162, 184, 0.3)',
            borderRadius: '16px'
          }}
        >
          <div className="card-body p-4">
            <h5 className="text-info mb-4">📄 Descriptions</h5>
            
            {/* Short Description */}
            <div className="mb-3">
              <label className="form-label text-light">Short Description</label>
              <textarea
                name="short_description"
                className="form-control bg-dark text-light border-secondary"
                rows="3"
                value={formData.short_description}
                onChange={handleChange}
                placeholder="Brief overview (will appear in cards)..."
                maxLength="300"
              />
              <small className="text-muted">
                {formData.short_description?.length || 0}/300 characters
              </small>
            </div>

            {/* Full Description */}
            <div className="mb-0">
              <label className="form-label text-light">Full Description</label>
              <textarea
                name="full_description"
                className="form-control bg-dark text-light border-secondary"
                rows="8"
                value={formData.full_description}
                onChange={handleChange}
                placeholder="Detailed project description..."
              />
              <small className="text-muted">
                Supports line breaks. HTML will be rendered.
              </small>
            </div>
          </div>
        </motion.div>

        {/* LINKS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card card-dark mb-4"
          style={{
            background: 'rgba(23, 162, 184, 0.05)',
            border: '1px solid rgba(23, 162, 184, 0.3)',
            borderRadius: '16px'
          }}
        >
          <div className="card-body p-4">
            <h5 className="text-info mb-4">🔗 Links</h5>
            
            <div className="row g-3">
              {/* Demo URL */}
              <div className="col-md-6">
                <label className="form-label text-light">Demo URL</label>
                <input
                  type="url"
                  name="demo_url"
                  className="form-control bg-dark text-light border-secondary"
                  value={formData.demo_url}
                  onChange={handleChange}
                  placeholder="https://demo.example.com"
                />
                <small className="text-muted">Live demo or deployed app</small>
              </div>

              {/* Repository URL */}
              <div className="col-md-6">
                <label className="form-label text-light">Repository URL</label>
                <input
                  type="url"
                  name="repo_url"
                  className="form-control bg-dark text-light border-secondary"
                  value={formData.repo_url}
                  onChange={handleChange}
                  placeholder="https://github.com/user/repo"
                />
                <small className="text-muted">GitHub, GitLab, etc.</small>
              </div>

              {/* Paper URL */}
              <div className="col-md-6">
                <label className="form-label text-light">Paper/Docs URL</label>
                <input
                  type="url"
                  name="paper_url"
                  className="form-control bg-dark text-light border-secondary"
                  value={formData.paper_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />
                <small className="text-muted">Research paper or documentation</small>
              </div>

              {/* Video URL */}
              <div className="col-md-6">
                <label className="form-label text-light">Video URL</label>
                <input
                  type="url"
                  name="video_url"
                  className="form-control bg-dark text-light border-secondary"
                  value={formData.video_url}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <small className="text-muted">Demo video or presentation</small>
              </div>
            </div>
          </div>
        </motion.div>

        {/* TAGS & FEATURES SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card card-dark mb-4"
          style={{
            background: 'rgba(23, 162, 184, 0.05)',
            border: '1px solid rgba(23, 162, 184, 0.3)',
            borderRadius: '16px'
          }}
        >
          <div className="card-body p-4">
            <h5 className="text-info mb-4">🏷️ Tags & Features</h5>
            
            <div className="row g-3">
              {/* Tags */}
              <div className="col-md-6">
                <label className="form-label text-light">Tags</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="AI, Machine Learning, IoT"
                />
                <small className="text-muted">Comma-separated keywords</small>
                {tagsInput && (
                  <div className="mt-2 d-flex flex-wrap gap-1">
                    {csvToArray(tagsInput).map((tag, i) => (
                      <span key={i} className="badge bg-dark text-info border border-info">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="col-md-6">
                <label className="form-label text-light">Key Features</label>
                <textarea
                  className="form-control bg-dark text-light border-secondary"
                  rows="3"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="Real-time processing, Cloud deployment, Mobile responsive"
                />
                <small className="text-muted">Comma-separated features</small>
                {featuresInput && (
                  <div className="mt-2">
                    <small className="text-success">
                      ✓ {csvToArray(featuresInput).length} features
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* METADATA SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card card-dark mb-4"
          style={{
            background: 'rgba(23, 162, 184, 0.05)',
            border: '1px solid rgba(23, 162, 184, 0.3)',
            borderRadius: '16px'
          }}
        >
          <div className="card-body p-4">
            <h5 className="text-info mb-4">⚙️ Metadata</h5>
            
            <div className="row g-3">
              {/* Tech Stack */}
              <div className="col-md-6">
                <label className="form-label text-light">Tech Stack</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  placeholder="React, Node.js, MongoDB, Python"
                />
                <small className="text-muted">Comma-separated technologies</small>
                {techStackInput && (
                  <div className="mt-2 d-flex flex-wrap gap-1">
                    {csvToArray(techStackInput).map((tech, i) => (
                      <span key={i} className="badge bg-dark text-info border border-info">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Team */}
              <div className="col-md-6">
                <label className="form-label text-light">Team Members</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  value={teamInput}
                  onChange={(e) => setTeamInput(e.target.value)}
                  placeholder="John Doe, Jane Smith, Bob Johnson"
                />
                <small className="text-muted">Comma-separated names</small>
              </div>

              {/* Duration */}
              <div className="col-md-6">
                <label className="form-label text-light">Duration</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  value={formData.metadata.duration}
                  onChange={(e) => handleMetadataChange('duration', e.target.value)}
                  placeholder="3 months, 2024-2025"
                />
                <small className="text-muted">Project timeline</small>
              </div>

              {/* Client/Funding */}
              <div className="col-md-6">
                <label className="form-label text-light">Client/Funding</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  value={formData.metadata.client}
                  onChange={(e) => handleMetadataChange('client', e.target.value)}
                  placeholder="ACME Corp, Research Grant XYZ"
                />
                <small className="text-muted">Sponsor or client</small>
              </div>
            </div>
          </div>
        </motion.div>

        // ProjectEditor.jsx - PART 3 (tambahkan setelah Metadata Section)

        {/* GALLERY SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card card-dark mb-4"
          style={{
            background: 'rgba(23, 162, 184, 0.05)',
            border: '1px solid rgba(23, 162, 184, 0.3)',
            borderRadius: '16px'
          }}
        >
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="text-info mb-0">🖼️ Gallery</h5>
              <motion.button
                type="button"
                className="btn btn-sm btn-info text-dark"
                style={{ borderRadius: '8px' }}
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    gallery: [...prev.gallery, { url: '', caption: '' }]
                  }));
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={16} className="me-1" />
                Add Image
              </motion.button>
            </div>

            {formData.gallery?.length === 0 ? (
              <div 
                className="text-center py-4 rounded"
                style={{ 
                  border: '2px dashed rgba(23, 162, 184, 0.3)',
                  background: 'rgba(23, 162, 184, 0.02)'
                }}
              >
                <ImageIcon size={48} className="text-info mb-2 opacity-50" />
                <p className="text-white-50 mb-0">No gallery images yet</p>
                <small className="text-muted">Click "Add Image" to start</small>
              </div>
            ) : (
              <div className="row g-3">
                {formData.gallery.map((item, idx) => (
                  <div key={idx} className="col-md-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3 rounded"
                      style={{
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(23, 162, 184, 0.2)'
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-info fw-semibold">Image {idx + 1}</small>
                        <motion.button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          style={{ borderRadius: '6px' }}
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              gallery: prev.gallery.filter((_, i) => i !== idx)
                            }));
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </div>

                      {/* 1. GANTI INPUT URL DENGAN IMAGEUPLOAD */}
                        <div className="mb-2">
                          <ImageUpload 
                            value={item.url}
                            onChange={(url) => {
                              // Perhatikan: di sini parameter langsung 'url', bukan event 'e'
                              const newGallery = [...formData.gallery];
                              newGallery[idx].url = url;
                              setFormData(prev => ({ ...prev, gallery: newGallery }));
                            }}
                            placeholder="Image URL or Upload"
                          />
                        </div>

                        {/* 2. INPUT CAPTION BIARKAN SEPERTI SEMULA (JANGAN DIGANTI) */}
                        <input
                          type="text"
                          className="form-control form-control-sm bg-dark text-light border-secondary mb-2"
                          placeholder="Caption (optional)"
                          value={item.caption}
                          onChange={(e) => {
                            const newGallery = [...formData.gallery];
                            newGallery[idx].caption = e.target.value;
                            setFormData(prev => ({ ...prev, gallery: newGallery }));
                          }}
                        />

                      {item.url && (
                        <div className="mt-2">
                          <img 
                            src={item.url} 
                            alt={`Gallery ${idx + 1}`}
                            className="img-fluid rounded"
                            style={{ maxHeight: '120px', width: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </motion.div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* CONTENT BLOCKS SECTION - THE MOST COMPLEX PART! */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card card-dark mb-4"
          style={{
            background: 'rgba(23, 162, 184, 0.05)',
            border: '1px solid rgba(23, 162, 184, 0.3)',
            borderRadius: '16px'
          }}
        >
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="text-info mb-1">🧩 Content Blocks</h5>
                <small className="text-muted">Build flexible page content</small>
              </div>
              
              {/* Add Block Dropdown */}
              <div className="dropdown">
                <motion.button
                  type="button"
                  className="btn btn-info text-dark dropdown-toggle"
                  style={{ borderRadius: '8px' }}
                  data-bs-toggle="dropdown"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={16} className="me-1" />
                  Add Block
                </motion.button>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li>
                    <button 
                      className="dropdown-item" 
                      type="button"
                      onClick={() => addContentBlock('text')}
                    >
                      <Type size={16} className="me-2" />
                      Text Block
                    </button>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item" 
                      type="button"
                      onClick={() => addContentBlock('image')}
                    >
                      <ImageIcon size={16} className="me-2" />
                      Image Block
                    </button>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item" 
                      type="button"
                      onClick={() => addContentBlock('video')}
                    >
                      <Video size={16} className="me-2" />
                      Video Embed
                    </button>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item" 
                      type="button"
                      onClick={() => addContentBlock('code')}
                    >
                      <Code size={16} className="me-2" />
                      Code Block
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {formData.content_blocks?.length === 0 ? (
              <div 
                className="text-center py-5 rounded"
                style={{ 
                  border: '2px dashed rgba(23, 162, 184, 0.3)',
                  background: 'rgba(23, 162, 184, 0.02)'
                }}
              >
                <List size={48} className="text-info mb-3 opacity-50" />
                <p className="text-white-50 mb-2">No content blocks yet</p>
                <small className="text-muted">Start adding blocks to build your project content</small>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {formData.content_blocks.map((block, idx) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-3 rounded position-relative"
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid rgba(23, 162, 184, 0.3)'
                    }}
                  >
                    {/* Block Header */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-info text-dark">
                          {block.type === 'text' && <Type size={14} />}
                          {block.type === 'image' && <ImageIcon size={14} />}
                          {block.type === 'video' && <Video size={14} />}
                          {block.type === 'code' && <Code size={14} />}
                          <span className="ms-1">{block.type.toUpperCase()}</span>
                        </span>
                        <small className="text-muted">Block {idx + 1}</small>
                      </div>

                      <div className="d-flex gap-2">
                        {/* Move Up */}
                        {idx > 0 && (
                          <motion.button
                            type="button"
                            className="btn btn-sm btn-outline-info"
                            style={{ borderRadius: '6px' }}
                            onClick={() => moveContentBlock(idx, 'up')}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Move up"
                          >
                            ↑
                          </motion.button>
                        )}
                        
                        {/* Move Down */}
                        {idx < (formData.content_blocks?.length || 0) - 1 && (
                          <motion.button
                            type="button"
                            className="btn btn-sm btn-outline-info"
                            style={{ borderRadius: '6px' }}
                            onClick={() => moveContentBlock(idx, 'down')}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Move down"
                          >
                            ↓
                          </motion.button>
                        )}

                        {/* Delete */}
                        <motion.button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          style={{ borderRadius: '6px' }}
                          onClick={() => removeContentBlock(block.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </div>
                    </div>

                    {/* Block Content Input */}
                    {block.type === 'text' && (
                      <textarea
                        className="form-control bg-dark text-light border-secondary"
                        rows="4"
                        placeholder="Enter your text content here..."
                        value={block.content}
                        onChange={(e) => updateContentBlock(block.id, e.target.value)}
                      />
                    )}

                    {block.type === 'image' && (
                      <div>
                        <div className="mb-2">
                          <ImageUpload 
                            value={block.content}
                            onChange={(url) => updateContentBlock(block.id, url)}
                            placeholder="Image URL or Upload"
                          />
                        </div>
                        {block.content && (
                          <div className="mt-2 text-center">
                            <img 
                              src={block.content} 
                              alt="Preview"
                              className="img-fluid rounded"
                              style={{ maxHeight: '300px' }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'video' && (
                      <div>
                        <input
                          type="url"
                          className="form-control bg-dark text-light border-secondary"
                          placeholder="Video embed URL (YouTube, Vimeo, etc.)"
                          value={block.content}
                          onChange={(e) => updateContentBlock(block.id, e.target.value)}
                        />
                        <small className="text-muted d-block mt-1">
                          Use embed URLs like: https://www.youtube.com/embed/VIDEO_ID
                        </small>
                      </div>
                    )}

                    {block.type === 'code' && (
                      <textarea
                        className="form-control bg-dark text-light border-secondary font-monospace"
                        rows="6"
                        placeholder="Paste your code here..."
                        value={block.content}
                        onChange={(e) => updateContentBlock(block.id, e.target.value)}
                        style={{ fontSize: '0.85rem' }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* DISPLAY OPTIONS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card card-dark mb-4"
          style={{
            background: 'rgba(23, 162, 184, 0.05)',
            border: '1px solid rgba(23, 162, 184, 0.3)',
            borderRadius: '16px'
          }}
        >
          <div className="card-body p-4">
            <h5 className="text-info mb-4">⚙️ Display Options</h5>
            
            <div className="row g-3">
              {/* Is Featured */}
              <div className="col-md-4">
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="is_featured"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    style={{ cursor: 'pointer' }}
                  />
                  <label className="form-check-label text-light" htmlFor="is_featured">
                    ⭐ Featured Project
                  </label>
                </div>
                <small className="text-muted d-block mt-1">
                  Show on homepage and top of list
                </small>
              </div>

              {/* Is Published */}
              <div className="col-md-4">
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="is_published"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleChange}
                    style={{ cursor: 'pointer' }}
                  />
                  <label className="form-check-label text-light" htmlFor="is_published">
                    👁️ Published
                  </label>
                </div>
                <small className="text-muted d-block mt-1">
                  Make visible to public
                </small>
              </div>

              {/* Display Order */}
              <div className="col-md-4">
                <label className="form-label text-light">Display Order</label>
                <input
                  type="number"
                  name="display_order"
                  className="form-control bg-dark text-light border-secondary"
                  value={formData.display_order}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
                <small className="text-muted d-block mt-1">
                  Lower numbers appear first
                </small>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SUBMIT BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="d-flex gap-3 justify-content-end"
        >
          <motion.button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="btn btn-outline-secondary"
            style={{ borderRadius: '10px' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={saving}
          >
            <X size={18} className="me-2" />
            Cancel
          </motion.button>

          <motion.button
            type="submit"
            className="btn btn-info text-dark fw-semibold"
            style={{ borderRadius: '10px', minWidth: '150px' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} className="me-2" />
                {isEdit ? 'Update Project' : 'Create Project'}
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
}
