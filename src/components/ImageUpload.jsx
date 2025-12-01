import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadProjectImage } from '../lib/apiProjects';

export default function ImageUpload({ value, onChange, placeholder = "Image URL", className = "" }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadProjectImage(file);
      // Backend mengembalikan { url: '/uploads/projects/...' }
      onChange(res.url); 
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
      // Reset input file agar bisa upload file yang sama jika perlu
      e.target.value = '';
    }
  };

  return (
    <div className={`d-flex gap-2 ${className}`}>
      <div className="flex-grow-1 position-relative">
        <input
          type="text"
          className="form-control bg-dark text-light border-secondary"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={uploading}
        />
        {uploading && (
          <div className="position-absolute end-0 top-0 h-100 d-flex align-items-center pe-3">
            <span className="spinner-border spinner-border-sm text-info" />
          </div>
        )}
      </div>
      
      <div>
        <input
          type="file"
          id={`file-upload-${Math.random()}`} // ID unik random
          className="d-none"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <label 
          htmlFor={document.activeElement?.nextElementSibling?.id || "file-upload-input"} // Trik focus
          className="btn btn-outline-info"
          style={{ borderRadius: '8px', whiteSpace: 'nowrap' }}
          onClick={(e) => {
             // Trigger input file sibling
             e.target.parentElement.querySelector('input[type="file"]').click();
          }}
        >
          <Upload size={18} className="me-1" /> 
          {uploading ? '...' : 'Upload'}
        </label>
      </div>
    </div>
  );
}
