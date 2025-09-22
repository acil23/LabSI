import React from "react";
import { Link } from "react-router-dom";
import logoIS from "../../public/assets/logo/logo_IS.jpg";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <img
          src={logoIS}
          className="rounded-4"
          alt="Logo"
          style={{ height: "40px", marginRight: "10px" }}
        />
        <Link className="navbar-brand" to="/">
          Lab Sistem Cerdas
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/anggota">
                Anggota
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/jurnal">
                Jurnal
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/berita">
                Berita & Agenda
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/kontak">
                Kontak
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
