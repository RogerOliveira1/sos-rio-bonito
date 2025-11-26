// src/pages/OcorrenciasPage.jsx
import React, { useEffect, useState } from "react";
import { listarOcorrencias, criarOcorrencia, deletarOcorrencia } from "../services/api";

export default function OcorrenciasPage() {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const [local, setLocal] = useState("");
  const [tipo, setTipo] = useState("alagamento");
  const [descricao, setDescricao] = useState("");
  const [urgencia, setUrgencia] = useState("baixa");

  async function carregarOcorrencias() {
    setCarregando(true);
    setErro("");

    try {
      const res = await listarOcorrencias();
      setOcorrencias(res.data);
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.error || "Erro ao carregar ocorrências");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarOcorrencias();
  }, []);

  async function handleCriarOcorrencia(e) {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    try {
      await criarOcorrencia({ local, tipo, descricao, urgencia });

      setLocal("");
      setTipo("alagamento");
      setDescricao("");
      setUrgencia("baixa");

      await carregarOcorrencias();
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.error || "Erro ao criar ocorrência");
    } finally {
      setCarregando(false);
    }
  }

  async function handleExcluirOcorrencia(id) {
    setCarregando(true);
    setErro("");

    try {
      await deletarOcorrencia(id);

      // Atualiza a lista sem precisar recarregar tudo
      setOcorrencias(prev => prev.filter(oc => oc.id !== id));
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.error || "Erro ao excluir ocorrência");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2>Ocorrências</h2>

      {erro && (
        <div style={{ marginBottom: "1rem", color: "red" }}>
          {erro}
        </div>
      )}

      <section
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <h3>Nova ocorrência</h3>
        <form onSubmit={handleCriarOcorrencia}>
          <div style={{ marginBottom: "0.75rem" }}>
            <label>Local</label>
            <input
              type="text"
              value={local}
              onChange={e => setLocal(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </div>

          <div style={{ marginBottom: "0.75rem", display: "flex", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label>Tipo</label>
              <select
                value={tipo}
                onChange={e => setTipo(e.target.value)}
                style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
              >
                <option value="alagamento">Alagamento</option>
                <option value="deslizamento">Deslizamento</option>
                <option value="incendio">Incêndio</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label>Urgência</label>
              <select
                value={urgencia}
                onChange={e => setUrgencia(e.target.value)}
                style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <label>Descrição</label>
            <textarea
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              required
              rows={3}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
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
            {carregando ? "Salvando..." : "Salvar ocorrência"}
          </button>
        </form>
      </section>

      <section>
        <h3>Lista de ocorrências</h3>
        {carregando && ocorrencias.length === 0 && <p>Carregando...</p>}
        {ocorrencias.length === 0 && !carregando && <p>Nenhuma ocorrência cadastrada.</p>}

        <ul style={{ listStyle: "none", padding: 0 }}>
        {ocorrencias.map((oc) => (
          <li
            key={oc.id}
            style={{
              background: "#fff",
              marginBottom: "0.75rem",
              padding: "0.75rem",
              borderRadius: "8px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{oc.tipo?.toUpperCase() || "OCORRÊNCIA"}</strong>
              <p style={{ margin: "0.25rem 0" }}>
                <b>Local:</b> {oc.local}
              </p>
              <p style={{ margin: "0.25rem 0" }}>
                <b>Urgência:</b> {oc.urgencia}
              </p>
              <p style={{ margin: "0.25rem 0" }}>{oc.descricao}</p>
            </div>

            <button
              onClick={() => handleExcluirOcorrencia(oc.id)}
              style={{
                padding: "0.4rem 0.8rem",
                borderRadius: "6px",
                border: "none",
                background: "#b3261e",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
      </section>
    </div>
  );
}
