import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getJournals } from "../../lib/api";
import AdminGate from "../../components/adminGate";
import { adminDeleteJournal } from "../../lib/api";
import { asAbsolute } from "../../lib/http";

export default function JournalsAdminList() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function load() {
    try {
      setLoading(true);
      const res = await getJournals({ page: 1, perPage: 200 });
      setItems(res.data || []);
      setErr("");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onDelete(slug) {
    if (!window.confirm("Hapus jurnal ini?")) return;
    try {
      await adminDeleteJournal(slug);
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <AdminGate>
    <section className="section section-dark">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/admin" className="btn btn-warning">Kembali</Link>
          <h2 className="text-light m-0">Kelola Jurnal</h2>
          <Link to="/admin/jurnal/new" className="btn btn-info">+ Tambah Jurnal</Link>
        </div>

        {err && <p className="text-danger">{err}</p>}
        <div className="card card-dark p-3">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr className="text-info">
                  <th style={{width: 60}}>#</th>
                  <th style={{width: 100}}>Thumb</th>
                  <th>Judul</th>
                  <th style={{width: 110}}>Tahun</th>
                  <th style={{width: 140}}>Tipe</th>
                  <th style={{width: 160}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr><td colSpan="6" className="text-center text-white-80 py-4">Belum ada data.</td></tr>
                )}
                {items.map((it, idx) => (
                  <tr key={it.slug}>
                    <td>{idx + 1}</td>
                    <td>
                      {it.thumb_url && (
                        <img
                          src={asAbsolute(it.thumb_url)}
                          alt={it.title}
                          style={{height: 50, width: 80, objectFit: "cover", borderRadius: 6}}
                        />
                      )}
                    </td>
                    <td>
                      <div className="text-light fw-semibold">{it.title}</div>
                      <div className="small text-white-50">{it.authors}</div>
                      <div className="small text-info">{it.venue}</div>
                    </td>
                    <td>{it.year}</td>
                    <td>{it.type}</td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => navigate(`/admin/jurnal/${it.slug}/edit`)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onDelete(it.slug)}
                        >
                          Hapus
                        </button>
                        <a
                          className="btn btn-sm btn-outline-light"
                          href={`/jurnal/${it.slug}`}
                          target="_blank" rel="noreferrer"
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

        {loading && <p className="mt-3 text-white-80">Memuat…</p>}
      </div>
    </section>
    </AdminGate>
  );
}
