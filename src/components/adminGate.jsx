import React, { useState } from "react";
import { isAdmin, loginAdmin, logoutAdmin } from "../lib/authAdmin";

export default function AdminGate({ children }) {
  const [authed, setAuthed] = useState(isAdmin());
  const [msg, setMsg] = useState("");

  if (authed) {
    return (
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <small className="text-white-80">Admin mode aktif</small>
          <button className="btn btn-sm btn-outline-light" onClick={() => { logoutAdmin(); setAuthed(false); }}>
            Keluar Admin
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="card card-dark p-4 mx-auto" style={{ maxWidth: 420 }}>
      <h5 className="text-light mb-3">Masuk Admin</h5>
      <form onSubmit={(e) => {
        e.preventDefault();
        const pass = e.currentTarget.password.value;
        if (loginAdmin(pass)) setAuthed(true);
        else setMsg("Password salah");
      }}>
        <input name="password" type="password" className="form-control bg-dark text-light border-secondary mb-2" placeholder="Admin password" />
        {msg && <div className="text-danger small mb-2">{msg}</div>}
        <button className="btn btn-primary w-100" type="submit">Masuk</button>
      </form>
    </div>
  );
}
