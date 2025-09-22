import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import BeritaIndex from "./pages/BeritaIndex";
import BeritaDetail from "./pages/BeritaDetail";
import Anggota from "./pages/Anggota";
import Jurnal from "./pages/Jurnal";
import Kontak from "./pages/Kontak";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/berita" element={<Layout><BeritaIndex /></Layout>} />
        <Route path="/berita/:slug" element={<Layout><BeritaDetail /></Layout>} />
        <Route path="/anggota" element={<Layout><Anggota /></Layout>} />
        <Route path="/jurnal" element={<Layout><Jurnal /></Layout>} />
        <Route path="/kontak" element={<Layout><Kontak /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
