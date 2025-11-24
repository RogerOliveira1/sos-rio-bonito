// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, registrarUsuario } from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [aba, setAba] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [role, setRole] = useState("user"); // "user" ou "admin"
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    try {
      const res = await login(email, senha);
      // backend devolve { token }
      localStorage.setItem("token", res.data.token);
      navigate("/ocorrencias");
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.error || "Erro ao fazer login");
    } finally {
      setCarregando(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    try {
      await registrarUsuario(nome, email, senha, role);
      setAba("login");
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.error || "Erro ao registrar usuário");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "2rem auto",
        padding: "2rem",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <button
          onClick={() => setAba("login")}
          style={{
            flex: 1,
            padding: "0.5rem",
            border: "none",
            borderBottom: aba === "login" ? "3px solid #0b4f6c" : "1px solid #ccc",
            background: "transparent",
            cursor: "pointer",
            fontWeight: aba === "login" ? "bold" : "normal",
          }}
        >
          Login
        </button>
        <button
          onClick={() => setAba("register")}
          style={{
            flex: 1,
            padding: "0.5rem",
            border: "none",
            borderBottom: aba === "register" ? "3px solid #0b4f6c" : "1px solid #ccc",
            background: "transparent",
            cursor: "pointer",
            fontWeight: aba === "register" ? "bold" : "normal",
          }}
        >
          Registrar
        </button>
      </div>

      {erro && (
        <div style={{ marginBottom: "1rem", color: "red", fontSize: "0.9rem" }}>
          {erro}
        </div>
      )}

      {aba === "login" ? (
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "0.75rem" }}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "#0b4f6c",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "0.75rem" }}>
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <label>Tipo de usuário</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            >
              <option value="user">Usuário comum</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={carregando}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "#0b4f6c",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      )}
    </div>
  );
}
