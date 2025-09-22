import React from "react";
import NewsSection from "../components/NewsSection";
import heroImage from "../../public/assets/gambar/hero-image.png";
import avatar from "../../public/assets/gambar/pakYudis.jpg";
import logo from "../../public/assets/logo/logo.png";

const members = [
  { id: 1, name: "Member 1", img: avatar },
  { id: 2, name: "Member 2", img: avatar },
  { id: 3, name: "Member 3", img: avatar },
  { id: 4, name: "Member 4", img: avatar },
  { id: 5, name: "Member 5", img: avatar },
  { id: 6, name: "Member 6", img: avatar },
  { id: 7, name: "Member 7", img: avatar },
  { id: 8, name: "Member 8", img: avatar },
];

function chunkArray(arr, size) {
  return arr.reduce((acc, _, i) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size));
    return acc;
  }, []);
}

function Home() {
  const memberChunks = chunkArray(members, 4);

  return (
    <div>
      {/* Hero Section - Updated with new design */}
      <section className="hero-section text-light">
        {/* Background geometric elements */}
        <div className="geometric-bg">
          <div className="circle-1"></div>
          <div className="circle-2"></div>
          <div className="circle-3"></div>
          <div className="dots-pattern"></div>
          <div className="dots-pattern-2"></div>
          <div className="curved-lines">
            <div className="curved-line-1"></div>
            <div className="curved-line-2"></div>
          </div>
        </div>

        {/* Main hero content */}
        <div className="hero-content">
          <div className="hero-card">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="hero-text">
                  <h1 className="fw-bold">
                    Exploring the Frontiers of Artificial Intelligence
                  </h1>
                  <p className="lead mt-3">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                  <div className="hero-buttons">
                    <button className="btn btn-primary btn-lg">Join Us</button>
                    <button className="btn btn-outline-light btn-lg">
                      More...
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="hero-image-container">
                  <div className="hero-image-wrapper">
                    <img
                      src={heroImage}
                      alt="Hero visual"
                      className="img-fluid"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Face of IS Lab */}
      <section className="section section-dark">
        <h2 className="section-title text-center mb-4">Face Of IS Lab</h2>

        <div
          id="labCarousel"
          className="carousel slide position-relative"
          data-bs-ride="carousel"
          data-bs-interval="3000"
        >
          <div className="carousel-inner">
            {memberChunks.map((chunk, idx) => (
              <div
                key={idx}
                className={`carousel-item ${idx === 0 ? "active" : ""}`}
              >
                <div className="row justify-content-center">
                  {chunk.map((m) => (
                    <div className="col-md-3 mb-4" key={m.id}>
                      <div className="card shadow-sm h-100 text-center card-dark">
                        <img
                          src={m.img}
                          className="card-img-top"
                          alt={m.name}
                        />
                        <div className="card-body">
                          <h5 className="card-title text-light">{m.name}</h5>
                          <p className="card-text">Research Interest</p>
                          <div>
                            <span className="card-r">Data Analyst</span>
                            <span className="card-r">Data Mining</span>
                            <span className="card-r">Intelligent System</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Kontrol */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#labCarousel"
            data-bs-slide="prev"
            style={{ left: "-3rem" }}
          >
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#labCarousel"
            data-bs-slide="next"
            style={{ right: "-3rem" }}
          >
            <span className="carousel-control-next-icon"></span>
          </button>

          {/* Indicator */}
          <div className="carousel-indicators">
            {memberChunks.map((_, idx) => (
              <button
                key={idx}
                type="button"
                data-bs-target="#labCarousel"
                data-bs-slide-to={idx}
                className={idx === 0 ? "active" : ""}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* Berita & Acara */}

      <NewsSection mainCount={4} listCount={5} />

      {/* Our Collaborations */}
      <section className="section section-dark">
        <h2 className="section-title text-center mb-4">Our Collaborations</h2>

        <div className="overflow-hidden py-3">
          <div className="d-flex align-items-center gap-5 logo-slider">
            {[...Array(2)].map((_, idx) =>
              [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <img
                  key={`${idx}-${i}`}
                  src={logo}
                  alt={`Logo ${i}`}
                  className="img-fluid"
                  style={{ maxHeight: "100px" }}
                />
              ))
            )}
          </div>
        </div>
        {/* Partner Count Stats */}
        <div className="row mt-5 text-center">
          <div className="col-md-3 col-6 mb-3">
            <div className="stat-card">
              <h3 className="stat-number">50+</h3>
              <p className="stat-label">Research Partners</p>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="stat-card">
              <h3 className="stat-number">25+</h3>
              <p className="stat-label">Industry Partners</p>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="stat-card">
              <h3 className="stat-number">15+</h3>
              <p className="stat-label">Countries</p>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="stat-card">
              <h3 className="stat-number">100+</h3>
              <p className="stat-label">Projects</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
