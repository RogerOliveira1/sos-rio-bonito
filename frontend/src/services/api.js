// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// coloca o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------- autenticação -------
export const login = (email, senha) =>
  api.post("/login", { email, senha });

export const registrarUsuario = (nome, email, senha, role = "user") =>
  api.post("/register", { nome, email, senha, role });

// ------- ocorrências -------
export const listarOcorrencias = () => api.get("/ocorrencias");

export const criarOcorrencia = (dados) =>
  api.post("/ocorrencias", dados);

export const deletarOcorrencia = (id) =>
  api.delete(`/ocorrencias/${id}`);

// (voluntários/admin você usa depois)
export default api;
