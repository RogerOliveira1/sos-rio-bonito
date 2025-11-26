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
  const [role] = useState("user"); // só manda "user" pro backend
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    try {
      const res = await login(email, senha);
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
    <div className="page auth-page">
      <h1 className="app-title">SOS Rio Bonito</h1>
      <p className="app-subtitle">
        Acesse o sistema para registrar ocorrências e vincular voluntários.
      </p>

      <div className="tabs">
        <button
          type="button"
          className={`tab ${aba === "login" ? "tab--active" : ""}`}
          onClick={() => setAba("login")}
        >
          Entrar
        </button>
        <button
          type="button"
          className={`tab ${aba === "register" ? "tab--active" : ""}`}
          onClick={() => setAba("register")}
        >
          Criar conta
        </button>
      </div>

      {erro && <div className="alert">{erro}</div>}

      {aba === "login" ? (
        <form className="form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-senha">Senha</label>
            <input
              id="login-senha"
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="btn btn-primary btn-full"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      ) : (
        <form className="form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="reg-nome">Nome completo</label>
            <input
              id="reg-nome"
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-senha">Senha</label>
            <input
              id="reg-senha"
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="btn btn-primary btn-full"
          >
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      )}
    </div>
  );
}
