import React from "react";

function About() {
  return (
    <>
      {/* Hero */}
      <section className="section section-dark py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <h1 className="display-6 fw-bold text-light mb-3">
                Laboratorium Sistem Cerdas
              </h1>
              <p className="lead text-white mb-4">
                Wadah riset dan pengembangan kecerdasan buatan di Fakultas Ilmu
                Komputer Universitas Brawijaya. Kami berfokus pada{" "}
                <span className="text-info fw-semibold">
                  Machine Learning, Computer Vision, NLP, dan Intelligent System
                </span>{" "}
                untuk menghasilkan riset berdampak dan solusi nyata.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <a href="/anggota" className="btn btn-info">
                  Lihat Anggota
                </a>
                <a href="/jurnal" className="btn btn-outline-light">
                  Publikasi & Jurnal
                </a>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="about-glass p-4 rounded-4">
                <h6 className="text-uppercase text-white-50 mb-2">Ringkas</h6>
                <ul className="list-unstyled mb-0 small text-white-50">
                  <li className="mb-2">• Didirikan: 2012</li>
                  <li className="mb-2">• Koordinator: Dr. Novanto Yudistira</li>
                  <li className="mb-2">• Program: S1/S2/S3 – FILKOM UB</li>
                  <li className="mb-0">
                    • Fokus: AI, Data Mining, IoT, CV, NLP
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misi & Fokus */}
      <section className="section section-dark pt-0 pb-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card card-dark h-100">
                <div className="card-body">
                  <h3 className="text-light mb-3">Misi</h3>
                  <ul className="text-white-80 mb-0">
                    <li className="mb-2">
                      Menghasilkan riset AI yang relevan industri & masyarakat.
                    </li>
                    <li className="mb-2">
                      Mendorong open collaboration dan publikasi bereputasi.
                    </li>
                    <li>
                      Membangun ekosistem pembelajaran dan produk inovatif.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card card-dark h-100">
                <div className="card-body">
                  <h3 className="text-light mb-3">Bidang Riset</h3>
                  <div className="d-flex flex-wrap gap-2">
                    {[
                      "Machine Learning",
                      "Deep Learning",
                      "Computer Vision",
                      "Natural Language Processing",
                      "Reinforcement Learning",
                      "IoT & Edge AI",
                      "Knowledge Graph",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="badge bg-info-subtle text-dark"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="row g-4 mt-1">
            {[
              { n: "40+", t: "Anggota aktif" },
              { n: "120+", t: "Publikasi & sitasi" },
              { n: "15+", t: "Kolaborasi riset" },
              { n: "8+", t: "Produk/Prototipe" },
            ].map((s) => (
              <div key={s.t} className="col-6 col-md-3">
                <div className="stat-tile rounded-4 p-3 text-center">
                  <div className="h2 text-info fw-bold mb-0">{s.n}</div>
                  <div className="small text-white">{s.t}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline singkat */}
      <section className="section section-dark py-5">
        <div className="container">
          <h3 className="text-light mb-4">Perkembangan Singkat</h3>
          <div className="timeline">
            {[
              {
                year: "2012",
                text: "Pembentukan Lab Sistem Cerdas di FILKOM.",
              },
              {
                year: "2016",
                text: "Mulai kolaborasi industri & riset nasional.",
              },
              {
                year: "2020",
                text: "Roadmap Deep Learning & layanan komputasi GPU.",
              },
              {
                year: "2024",
                text: "Aplikasi AI untuk kesehatan & smart city.",
              },
            ].map((it) => (
              <div key={it.year} className="timeline-item">
                <div className="dot" />
                <div className="content">
                  <div className="text-info fw-bold">{it.year}</div>
                  <div className="text-white small">{it.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kontak ringkas */}
      <section className="section section-dark pb-5 pt-0">
        <div className="container">
          <div className="card card-dark">
            <div className="card-body">
              <div className="row g-4">
                <div className="col-lg-6">
                  <h4 className="text-light mb-3">Hubungi Kami</h4>
                  <ul className="list-unstyled text-white-80 mb-0">
                    <li className="mb-2">
                      📍{" "}
                      <span className="ms-1">
                        Gedung F, FILKOM UB, Malang, Indonesia
                      </span>
                    </li>
                    <li className="mb-2">✉️ labsic@filkom.ub.ac.id</li>
                    <li className="mb-2">🌐 filkom.ub.ac.id</li>
                  </ul>
                </div>
                <div className="col-lg-6">
                  <h6 className="text-white-50 mb-2">Tautan Cepat</h6>
                  <div className="d-flex flex-wrap gap-2">
                    <a href="/anggota" className="btn btn-sm btn-outline-info">
                      Direktori Anggota
                    </a>
                    <a href="/jurnal" className="btn btn-sm btn-outline-info">
                      Daftar Jurnal
                    </a>
                    <a href="/berita" className="btn btn-sm btn-outline-info">
                      Berita & Agenda
                    </a>
                  </div>
                  <p className="small text-white-50 mt-3 mb-0">
                    Untuk undangan kolaborasi/riset, silakan email kami.
                    Response biasanya &lt; 2 hari kerja.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
