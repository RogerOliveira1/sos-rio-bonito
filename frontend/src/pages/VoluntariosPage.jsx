// src/pages/VoluntariosPage.jsx
import React, { useEffect, useState } from "react";
import {
  listarVoluntarios,
  criarVoluntario,
  listarOcorrencias,
} from "../services/api";

export default function VoluntariosPage() {
  const [voluntarios, setVoluntarios] = useState([]);
  const [ocorrencias, setOcorrencias] = useState([]);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [area, setArea] = useState("");
  const [ocorrenciaId, setOcorrenciaId] = useState("");

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function carregarDados() {
    setCarregando(true);
    setErro("");

    try {
      const [resVol, resOc] = await Promise.all([
        listarVoluntarios(),
        listarOcorrencias(),
      ]);

      setVoluntarios(resVol.data);
      setOcorrencias(resOc.data);
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.error || "Erro ao carregar voluntários");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function handleCriarVoluntario(e) {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    try {
      const dados = {
        nome,
        telefone,
        area,
        ocorrenciaId: ocorrenciaId ? Number(ocorrenciaId) : null,
      };

      await criarVoluntario(dados);

      setNome("");
      setTelefone("");
      setArea("");
      setOcorrenciaId("");

      await carregarDados();
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.error || "Erro ao criar voluntário");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2>Voluntários</h2>

      {erro && (
        <div style={{ marginBottom: "1rem", color: "red" }}>
          {erro}
        </div>
      )}

      {/* Formulário de cadastro */}
      <section
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <h3>Novo voluntário</h3>

        <form onSubmit={handleCriarVoluntario}>
          <div style={{ marginBottom: "0.75rem" }}>
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <label>Telefone</label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <label>Área de atuação</label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <label>Ocorrência relacionada</label>
            <select
              value={ocorrenciaId}
              onChange={(e) => setOcorrenciaId(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            >
              <option value="">(nenhuma)</option>
              {ocorrencias.map((oc) => (
                <option key={oc.id} value={oc.id}>
                  #{oc.id} - {oc.tipo} - {oc.local}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={carregando}
            style={{
              padding: "0.6rem 1.2rem",
              background: "#0b4f6c",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {carregando ? "Salvando..." : "Salvar voluntário"}
          </button>
        </form>
      </section>

      {/* Lista de voluntários */}
      <section>
        <h3>Lista de voluntários</h3>

        {carregando && voluntarios.length === 0 && <p>Carregando...</p>}
        {voluntarios.length === 0 && !carregando && (
          <p>Nenhum voluntário cadastrado.</p>
        )}

        <ul style={{ listStyle: "none", padding: 0 }}>
          {voluntarios.map((v) => (
            <li
              key={v.id}
              style={{
                background: "#fff",
                marginBottom: "0.75rem",
                padding: "0.75rem",
                borderRadius: "8px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <strong>{v.nome}</strong>
              <p style={{ margin: "0.25rem 0" }}>
                <b>Telefone:</b> {v.telefone}
              </p>
              <p style={{ margin: "0.25rem 0" }}>
                <b>Área:</b> {v.area || "-"}
              </p>
              <p style={{ margin: "0.25rem 0" }}>
                <b>Ocorrência:</b>{" "}
                {v.ocorrencia
                  ? `#${v.ocorrencia.id} - ${v.ocorrencia.tipo} - ${v.ocorrencia.local}`
                  : "(não vinculada)"}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}