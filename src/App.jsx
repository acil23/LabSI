import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AnggotaIndex from "./pages/AnggotaIndex";
import AnggotaDetail from "./pages/AnggotaDetail";
import BeritaIndex from "./pages/BeritaIndex";
import BeritaDetail from "./pages/BeritaDetail";
import Jurnal from "./pages/Jurnal";
import Kontak from "./pages/Kontak";
import MembersAdminList from "./pages/admin/MembersAdminList";
import MemberEditor from "./pages/admin/MemberEditor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/anggota" element={<Layout><AnggotaIndex /></Layout>} />
        <Route path="/anggota/:slug" element={<Layout><AnggotaDetail /></Layout>} />
        <Route path="/berita" element={<Layout><BeritaIndex /></Layout>} />
        <Route path="/berita/:slug" element={<Layout><BeritaDetail /></Layout>} />
        <Route path="/jurnal" element={<Layout><Jurnal /></Layout>} />
        <Route path="/kontak" element={<Layout><Kontak /></Layout>} />
        <Route path="/admin/anggota" element={<Layout><MembersAdminList /></Layout>} />
        <Route path="/admin/anggota/new" element={<Layout><MemberEditor /></Layout>} />
        <Route path="/admin/anggota/:slug/edit" element={<Layout><MemberEditor /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
