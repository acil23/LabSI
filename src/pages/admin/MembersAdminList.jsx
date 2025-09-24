import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminGate from "../../components/adminGate";
import { listMembers, deleteMember } from "../../lib/apiMembers";

export default function MembersAdminList() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const { data } = await listMembers({
        page: 1,
        perPage: 50,
        filters: { q },
      });
      setItems(data || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [q]);

  async function onDelete(slug) {
    if (!window.confirm("Hapus anggota ini?")) return;
    try {
      await deleteMember(slug);
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <section className="section section-dark">
      <h2 className="section-title mb-3">Admin • Anggota</h2>
      <AdminGate>
        <div className="d-flex justify-content-between mb-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama..."
            className="form-control bg-dark text-light border-secondary w-50"
          />
          <Link to="/admin/anggota/new" className="btn btn-primary">
            + Tambah Anggota
          </Link>
        </div>
        {err && <p className="text-danger">{err}</p>}
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-striped align-middle">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Jabatan</th>
                  <th>Prodi</th>
                  <th>Email</th>
                  <th style={{ width: 160 }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((m) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.position}</td>
                    <td>{m.program}</td>
                    <td>
                      <a href={`mailto:${m.email}`}>{m.email}</a>
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/admin/anggota/${m.slug}/edit`}
                        className="btn btn-sm btn-outline-light me-2"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(m.slug)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {!items.length && (
                  <tr>
                    <td colSpan="5">Kosong.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </AdminGate>
    </section>
  );
}
