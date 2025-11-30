import { API_BASE } from "./http";

// Get all projects with filters
export async function getProjects({ page = 1, perPage = 12, category = "", status = "", year = "", q = "", featured = false } = {}) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("perPage", perPage);
  if (category) params.append("category", category);
  if (status) params.append("status", status);
  if (year) params.append("year", year);
  if (q) params.append("q", q);
  if (featured) params.append("featured", "true");

  const res = await fetch(`${API_BASE}/projects?${params}`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json(); // { data: [...], count: 100, page: 1, perPage: 12 }
}

// Get single project by slug
export async function getProjectBySlug(slug) {
  const res = await fetch(`${API_BASE}/projects/${slug}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Project not found");
    throw new Error("Failed to fetch project");
  }
  return res.json();
}

// Get project categories
export async function getProjectCategories() {
  const res = await fetch(`${API_BASE}/projects/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json(); // { data: [...] }
}

// Get featured projects
export async function getFeaturedProjects(limit = 6) {
  const res = await fetch(`${API_BASE}/projects/featured?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch featured projects");
  return res.json();
}

// ===================
// ADMIN API CALLS
// ===================

// Create project (Admin)
export async function adminCreateProject(projectData) {
  const res = await fetch(`${API_BASE}/admin/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projectData),
  });
  if (!res.ok) throw new Error("Failed to create project");
  return res.json();
}

// Update project (Admin)
export async function adminUpdateProject(slug, projectData) {
  const res = await fetch(`${API_BASE}/admin/projects/${slug}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projectData),
  });
  if (!res.ok) throw new Error("Failed to update project");
  return res.json();
}

// Delete project (Admin)
export async function adminDeleteProject(slug) {
  const res = await fetch(`${API_BASE}/admin/projects/${slug}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete project");
  return res.json();
}

// Get all projects for admin (includes unpublished)
export async function adminListProjects({ page = 1, perPage = 20, q = "" } = {}) {
  const params = new URLSearchParams({ page, perPage });
  if (q) params.append("q", q);
  
  const res = await fetch(`${API_BASE}/admin/projects?${params}`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}
