// src/app.jsx
import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import OcorrenciasPage from "./pages/OcorrenciasPage.jsx";
import VoluntariosPage from "./pages/VoluntariosPage.jsx";

export default function App() {
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-title">
          <span className="topbar-logo">⚠️</span>
          <div>
            <h1>SOS Rio Bonito</h1>
            <p>Sistema de cadastro de ocorrências e voluntários</p>
          </div>
        </div>

        <nav className="topbar-nav">
          {!isAuthenticated && (
            <Link to="/" className="nav-link">
              Login
            </Link>
          )}

          {isAuthenticated && (
            <>
              <Link to="/ocorrencias" className="nav-link">
                Ocorrências
              </Link>
              <Link to="/voluntarios" className="nav-link">
                Voluntários
              </Link>
            </>
          )}

          {isAuthenticated && (
            <button className="btn btn-outline" onClick={handleLogout}>
              Sair
            </button>
          )}
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/ocorrencias" element={<OcorrenciasPage />} />
          <Route path="/voluntarios" element={<VoluntariosPage />} />
        </Routes>
      </main>
    </div>
  );
}
