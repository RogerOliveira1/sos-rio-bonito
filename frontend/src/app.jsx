// src/app.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import OcorrenciasPage from "./pages/OcorrenciasPage.jsx";
import VoluntariosPage from "./pages/VoluntariosPage.jsx";

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", minHeight: "100vh", background: "#f5f5f5" }}>
      <header style={{ padding: "1rem", background: "#0b4f6c", color: "#fff" }}>
        <h1>SOS Rio Bonito</h1>
        <nav style={{ marginTop: "0.5rem", display: "flex", gap: "1rem" }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Login</Link>
          <Link to="/ocorrencias" style={{ color: "#fff", textDecoration: "none" }}>
            Ocorrências
          </Link>
          <Link to="/voluntarios" style={{ color: "#fff", textDecoration: "none" }}>
            Voluntários
          </Link>
        </nav>
      </header>

      <main style={{ padding: "1.5rem" }}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/ocorrencias" element={<OcorrenciasPage />} />
          <Route path="/voluntarios" element={<VoluntariosPage />} />
        </Routes>
      </main>
    </div>
  );
}