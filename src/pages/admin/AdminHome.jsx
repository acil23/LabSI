import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";

export default function AdminHome() {
  return (
    <Layout>
      <section className="section section-dark">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-light m-0">Admin Dashboard</h2>
            {/* (opsional) tempat tombol logout nanti */}
          </div>

          <div className="row g-4">
            {/* Kartu: CRUD Anggota */}
            <div className="col-md-6">
              <div className="card card-dark h-100 p-3">
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-circle bg-info-subtle" style={{ width: 48, height: 48 }} />
                  <div>
                    <h5 className="text-light mb-1">Anggota</h5>
                    <p className="text-white-80 mb-3">Kelola data anggota (tambah, ubah, hapus).</p>
                    <div className="d-flex gap-2">
                      <Link to="/admin/anggota" className="btn btn-outline-info btn-sm">Lihat Daftar</Link>
                      <Link to="/admin/anggota/new" className="btn btn-info btn-sm">Tambah Anggota</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kartu: CRUD Berita */}
            <div className="col-md-6">
              <div className="card card-dark h-100 p-3">
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-circle bg-info-subtle" style={{ width: 48, height: 48 }} />
                  <div>
                    <h5 className="text-light mb-1">Berita & Acara</h5>
                    <p className="text-white-80 mb-3">Kelola berita & agenda (tambah, ubah, hapus).</p>
                    <div className="d-flex gap-2">
                      <Link to="/admin/berita" className="btn btn-outline-info btn-sm">Lihat Daftar</Link>
                      <Link to="/admin/berita/new" className="btn btn-info btn-sm">Tulis Berita</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Kartu: CRUD Jurnal */}
            <div className="col-md-6">
              <div className="card card-dark h-100 p-3">
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-circle bg-info-subtle" style={{ width: 48, height: 48 }} />
                  <div>
                    <h5 className="text-light mb-1">Jurnal</h5>
                    <p className="text-white-80 mb-3">Kelola publikasi jurnal & konferensi.</p>
                    <div className="d-flex gap-2">
                      <Link to="/admin/jurnal" className="btn btn-outline-info btn-sm">Lihat Daftar</Link>
                      <Link to="/admin/jurnal/new" className="btn btn-info btn-sm">Tambah Jurnal</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* (opsional) Kartu-kartu lain nanti */}
            {/* <div className="col-md-6">… Jurnal / About / Media …</div> */}
          </div>
        </div>
      </section>
    </Layout>
  );
}
