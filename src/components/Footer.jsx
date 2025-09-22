import React from "react";

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container text-center">
        <p className="mb-1">&copy; {new Date().getFullYear()} Laboratorium Sistem Cerdas - Filkom UB</p>
        <small>Fakultas Ilmu Komputer, Universitas Brawijaya</small>
      </div>
    </footer>
  );
}

export default Footer;
