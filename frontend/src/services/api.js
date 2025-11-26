// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// ⬇⬇⬇ ADICIONE ISSO AQUI ⬇⬇⬇
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// ⬆⬆⬆ ADICIONE ISSO AQUI ⬆⬆⬆

// Já tinha antes: trata respostas 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/"; // manda pro login
    }
    return Promise.reject(error);
  }
);

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

// ------- voluntários -------
export const listarVoluntarios = () => api.get("/voluntarios");

export const criarVoluntario = (dados) =>
  api.post("/voluntarios", dados);

export default api;
