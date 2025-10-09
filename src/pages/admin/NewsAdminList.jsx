import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../../lib/http";
import AdminGate from "../../components/adminGate";

function formatDate(iso) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")} / ${String(
    d.getMonth() + 1
  ).padStart(2, "0")} / ${d.getFullYear()}`;
}

export default function NewsAdminList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function loadNews() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/news?page=1&perPage=100`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Gagal memuat berita");
      setItems(j.data || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNews();
  }, []);

  async function handleDelete(slug) {
    if (!window.confirm("Yakin ingin menghapus berita ini?")) return;
    try {
      const res = await fetch(`${API_BASE}/admin/news/${slug}`, {
        method: "DELETE",
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Gagal menghapus berita");
      alert("✅ Berita berhasil dihapus");
      loadNews();
    } catch (e) {
      alert("❌ " + e.message);
    }
  }

  if (loading) return <section className="section section-dark"><p>Loading...</p></section>;
  if (err) return <section className="section section-dark"><p className="text-danger">{err}</p></section>;

  return (
    <section className="section section-dark">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-light m-0">Kelola Berita & Acara</h2>
          <Link to="/admin/berita/new" className="btn btn-info">+ Tambah Berita Baru</Link>
        </div>
        <AdminGate>
        <div className="card card-dark p-3">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr className="text-info">
                  <th style={{ width: "5%" }}>#</th>
                  <th>Judul</th>
                  <th style={{ width: "10%" }}>Kategori</th>
                  <th style={{ width: "15%" }}>Tanggal</th>
                  <th style={{ width: "20%" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-white-80 py-3">
                      Belum ada berita.
                    </td>
                  </tr>
                )}
                {items.map((n, i) => (
                  <tr key={n.slug}>
                    <td>{i + 1}</td>
                    <td>
                      <strong className="text-light">{n.title}</strong>
                      <div className="small text-white-50">{n.excerpt}</div>
                    </td>
                    <td>{n.category}</td>
                    <td>{formatDate(n.date)}</td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => navigate(`/admin/berita/${n.slug}/edit`)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(n.slug)}
                        >
                          Hapus
                        </button>
                        <a
                          href={`/berita/${n.slug}`}
                          className="btn btn-sm btn-outline-light"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Lihat
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </AdminGate>
      </div>
    </section>
  );
}
