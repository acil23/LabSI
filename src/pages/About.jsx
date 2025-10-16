import React from "react";
import { Link } from "react-router-dom";
import NeuralNetworkBackground from "../components/NeuralNetworkBackground";

export default function About() {
  return (
    <div className="page-with-bg">
      <NeuralNetworkBackground />

      <section className="section section-dark pb-0">
        <header className="about-hero text-center">
          <h1 className="display-6 fw-bold mb-2 text-white">Tentang Laboratorium Sistem Cerdas</h1>
          <p className="text-white-50 m-auto" style={{maxWidth: 760}}>
            Eksplorasi bidang <em>Artificial Intelligence</em> di FILKOM UB—riset, edukasi, dan kolaborasi
            yang berdampak.
          </p>
        </header>
      </section>

      {/* SEKILAS */}
      <section className="section section-dark pt-0">
        <div className="container-xxl">
          <h2 className="section-title text-center mb-4">Sekilas</h2>

          <div className="row align-items-center g-4 about-intro">
            <div className="col-lg-6">
              <div className="about-card p-4 p-md-4">
                <p className="mb-3 text-white">
                  Laboratorium Sistem Cerdas merupakan salah satu laboratorium komputer yang memfokuskan diri pada bidang
                  pengembangan sistem cerdas di Fakultas Ilmu Komputer Universitas Brawijaya (FILKOM UB). Laboratorium
                  Sistem Cerdas terletak di Gedung F FILKOM UB. Adapun kegiatan yang dapat dilakukan di lingkup
                  laboratorium Sistem Cerdas meliputi kegiatan praktikum, penggunaan ruang laboratorium, penggunaan
                  laboratorium untuk penelitian dan kerjasama penelitian, pengabdian masyarakat, praktik pembelajaran,
                  diskusi, simulasi, pengerjaan skripsi, sertifikasi atau sejenisnya.
                </p>
                <p className="mb-0 text-white">
                  Fungsi utama dari laboratorium sebagai sarana untuk melakukan praktik atau penerapan atas teori,
                  penelitian dan pengembangan keilmuan di lingkungan FILKOM UB, sehingga menjadi unsur penting dalam
                  kegiatan pendidikan, pengabdian, dan penelitian.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-photo shadow-lg rounded-4 overflow-hidden">
                <img
                  src="/assets/about/lab-room.jpg"
                  alt="Ruang Laboratorium Sistem Cerdas"
                  className="w-100 h-100"
                  style={{objectFit: "cover"}}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEPALA LAB */}
      <section className="section section-dark pt-0">
        <div className="container-xxl">
          <div className="about-head row g-4 align-items-center">
            <div className="col-md-3 text-center">
              <img
                src="/assets/about/pakYudis.jpg"
                alt="Dr.Eng. Novanto Yudistira"
                className="rounded-circle shadow"
                style={{width: 140, height: 140, objectFit: "cover"}}
              />
            </div>
            <div className="col-md-9">
              <h3 className="fw-extrabold mb-1 text-white">Kepala Laboratorium</h3>
              <div className="about-underline mb-2" />
              <p className="text-white-80 mb-1 text-white-50">Selamat datang di Laboratorium Sistem Cerdas</p>
              <h4 className="mb-3 text-white">Dr.Eng. Novanto Yudistira, S.Kom., M.Sc.</h4>
              <Link to="/anggota" className="btn btn-warning fw-semibold">
                Sumber Daya Manusia
                <span className="ms-2">➜</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* KONTAK & SOSIAL */}
      <section className="section section-dark pt-0">
        <div className="container-xxl">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="about-mini card-dark p-3 h-100">
                <h6 className="text-info mb-2">Lokasi</h6>
                <p className="mb-0 text-white-80">
                  FILKOM Universitas Brawijaya<br />
                  Gedung F — Lantai 9
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="about-mini card-dark p-3 h-100">
                <h6 className="text-info mb-2">Email</h6>
                <a href="mailto:labkc@ub.ac.id" className="text-white-80 text-decoration-none">labkc@ub.ac.id</a>
              </div>
            </div>

            <div className="col-md-4">
              <div className="about-mini card-dark p-3 h-100">
                <h6 className="text-info mb-2">Instagram</h6>
                <a
                  href="https://instagram.com/is.lab.filkom"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-info btn-sm"
                >
                  @is.lab.filkom
                </a>
                <p className="small text-white-50 mb-0 mt-2">
                  Exploring the Frontiers of Artificial Intelligence
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
