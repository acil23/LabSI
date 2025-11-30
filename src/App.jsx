import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AnggotaIndex from "./pages/AnggotaIndex";
import AnggotaDetail from "./pages/AnggotaDetail";
import BeritaIndex from "./pages/BeritaIndex";
import BeritaDetail from "./pages/BeritaDetail";
import AdminHome from "./pages/admin/AdminHome";
import MembersAdminList from "./pages/admin/MembersAdminList";
import MemberEditor from "./pages/admin/MemberEditor";
import JurnalIndex from "./pages/JurnalIndex";
import JurnalDetail from "./pages/JurnalDetail";
import About from "./pages/About";
import NewsAdminList from "./pages/admin/NewsAdminList";
import NewsEditor from "./pages/admin/NewsEditor";
import JournalsAdminList from "./pages/admin/JournalsAdminList";
import JournalEditor from "./pages/admin/JournalEditor";
import CollabAdminList from "./pages/admin/CollabAdminList";
import CollabEditor from "./pages/admin/CollabEditor";
import PageTransition from './components/PageTransition';
import './components/transitions.css';
import { LanguageProvider } from './contexts/LanguageContext';

// C. saya akan implement sendiri

// Berikutnya saya mau bantuan untuk membuat halaman baru, yaitu product dan project yang menampilkan karya atau hasil dari lab ini

// contoh datanya seperti berikut

export default function App() {
  return (
    <PageTransition>
    <LanguageProvider>
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="anggota" element={<Layout><AnggotaIndex /></Layout>} />
      <Route path="anggota/:slug" element={<Layout><AnggotaDetail /></Layout>} />
      <Route path="berita" element={<Layout><BeritaIndex /></Layout>} />
      <Route path="berita/:slug" element={<Layout><BeritaDetail /></Layout>} />
      <Route path="admin" element={<AdminHome />} />
      <Route path="admin/anggota" element={<Layout><MembersAdminList /></Layout>} />
      <Route path="admin/anggota/new" element={<Layout><MemberEditor /></Layout>} />
      <Route path="admin/anggota/:slug/edit" element={<Layout><MemberEditor /></Layout>} />
      <Route path="jurnal" element={<Layout><JurnalIndex /></Layout>} />
      <Route path="jurnal/:slug" element={<Layout><JurnalDetail /></Layout>} />
      <Route path="about" element={<Layout><About /></Layout>} />
      <Route path="admin/berita" element={<Layout><NewsAdminList /></Layout>} />
      <Route path="admin/berita/new" element={<Layout><NewsEditor /></Layout>} />
      <Route path="admin/berita/:slug/edit" element={<Layout><NewsEditor /></Layout>} />
      <Route path="admin/jurnal" element={<Layout><JournalsAdminList /></Layout>} />
      <Route path="admin/jurnal/new" element={<Layout><JournalEditor /></Layout>} />
      <Route path="admin/jurnal/:slug/edit" element={<Layout><JournalEditor /></Layout>} />
      <Route path="admin/kolaborasi" element={<Layout><CollabAdminList /></Layout>} />
      <Route path="admin/kolaborasi/new" element={<Layout><CollabEditor /></Layout>} />
      <Route path="admin/kolaborasi/:id/edit" element={<Layout><CollabEditor /></Layout>} />
      <Route path="*" element={<div>Not found</div>} />
    </Routes>
    </LanguageProvider>
    </PageTransition>
  );
}
