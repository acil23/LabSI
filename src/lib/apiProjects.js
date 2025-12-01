// src/lib/apiProjects.js
import { http } from './http';

// ========== PUBLIC API ==========

// Get all projects with filters
export async function getProjects({ 
  page = 1, 
  perPage = 12, 
  category = "", 
  status = "", 
  year = "", 
  q = "", 
  featured = false 
} = {}) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("perPage", perPage);
  if (category) params.append("category", category);
  if (status) params.append("status", status);
  if (year) params.append("year", year);
  if (q) params.append("q", q);
  if (featured) params.append("featured", "true");

  return http.get(`/projects?${params.toString()}`);
}

// Get single project by slug
export async function getProjectBySlug(slug) {
  return http.get(`/projects/${slug}`);
}

// Get project categories
export async function getProjectCategories() {
  return http.get(`/projects/categories`);
}

// Get featured projects
export async function getFeaturedProjects(limit = 6) {
  return http.get(`/projects/featured?limit=${limit}`);
}

// ========== ADMIN API ==========

// Get all projects for admin (includes unpublished)
export async function adminListProjects({ page = 1, perPage = 20, q = "" } = {}) {
  const params = new URLSearchParams({ page, perPage });
  if (q) params.append("q", q);
  
  return http.get(`/admin/projects?${params.toString()}`);
}

// Create project (Admin)
export async function adminCreateProject(projectData) {
  return http.post(`/admin/projects`, projectData);
}

// Update project (Admin)
export async function adminUpdateProject(slug, projectData) {
  return http.patch(`/admin/projects/${slug}`, projectData);
}

// Delete project (Admin)
export async function adminDeleteProject(slug) {
  return http.del(`/admin/projects/${slug}`);
}


export async function uploadProjectImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  // Menggunakan http.uploadForm yang sudah ada di http.js Anda
  return http.uploadForm('/uploads/projects', formData);
}
