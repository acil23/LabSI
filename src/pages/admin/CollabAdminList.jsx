import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCollaborationsAdmin, deleteCollaboration } from "../../lib/api";
import { asAbsolute } from "../../lib/http";
import AdminGate from "../../components/adminGate";

export default function CollabAdminList() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await listCollaborationsAdmin({ page, perPage, q });
      setItems(res.data || []);
      setCount(res.count || 0);
      setErr("");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, q]);

  const onDelete = async (id) => {
    if (!confirm("Hapus kolaborasi ini?")) return;
    try {
      await deleteCollaboration(id);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const totalPages = Math.max(1, Math.ceil(count / perPage));

  return (
    <AdminGate>
      <section className="section section-dark">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Link to="/admin" className="btn btn-warning">Kembali</Link>
          <h2 className="section-title m-0">Kelola Kolaborasi</h2>
          <Link to="/admin/kolaborasi/new" className="btn btn-info">+ Tambah</Link>
        </div>
        
        <div className="card card-dark p-3 mb-3">
          <div className="row g-2 align-items-center">
            <div className="col-sm-6">
              <input
                value={q}
                onChange={(e) => { setPage(1); setQ(e.target.value); }}
                placeholder="Cari nama atau organisasi…"
                className="form-control bg-dark text-light"
              />
            </div>
            <div className="col-sm text-sm-end text-muted small">
              Total: {count}
            </div>
          </div>
        </div>

        {loading && <p className="text-white-80">Memuat…</p>}
        {err && <p className="text-danger">{err}</p>}

        <div className="row">
          {items.map((c) => (
            <div className="col-md-6 col-lg-4 mb-3" key={c.id}>
              <div className="card card-dark h-100 p-3 d-flex">
                <div className="d-flex align-items-center gap-3 mb-2">
                  {c.logo_url && <img src={asAbsolute(c.logo_url)} alt={c.name} style={{height:56}} />}
                  <div>
                    <div className="fw-semibold text-light">{c.name}</div>
                    <div className="text-white-50 small">{c.organization || "-"}</div>
                  </div>
                </div>
                <div className="mt-auto d-flex gap-2">
                  <Link to={`/admin/kolaborasi/${c.id}/edit`} className="btn btn-sm btn-outline-info">Edit</Link>
                  <button onClick={() => onDelete(c.id)} className="btn btn-sm btn-outline-danger">Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-3">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${page<=1?'disabled':''}`}>
                <button className="page-link" onClick={() => setPage(p => Math.max(1, p-1))}>Prev</button>
              </li>
              {[...Array(totalPages)].map((_,i)=>(
                <li key={i} className={`page-item ${page===i+1?'active':''}`}>
                  <button className="page-link" onClick={()=>setPage(i+1)}>{i+1}</button>
                </li>
              ))}
              <li className={`page-item ${page>=totalPages?'disabled':''}`}>
                <button className="page-link" onClick={() => setPage(p => Math.min(totalPages, p+1))}>Next</button>
              </li>
            </ul>
          </nav>
        )}
      </section>
    </AdminGate>
  );
}
