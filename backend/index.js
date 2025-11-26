const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const PORT = 3000;

app.use(cors({
  origin: "http://localhost:5173", //cria porta do vite
}));
app.use(express.json());

const SECRET = "sosriobonito-secret-key";

// Middleware: verificar se usuário está logado
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token ausente" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido" });
  }
}

// Middleware: verificar se é admin
function admin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Acesso negado (apenas admin)" });
  }
  next();
}

// Criar usuário (admin OU comum)
app.post("/register", async (req, res) => {
  const { nome, email, senha, role } = req.body;

  const hash = await bcrypt.hash(senha, 10);

  try {
    const user = await prisma.user.create({
      data: { nome, email, senha: hash, role },
    });
    res.json(user);
  } catch (err) {
    console.error("ERRO AO CRIAR USUÁRIO:", err); // <-- loga no terminal
    return res
      .status(400)
      .json({ error: err.message || "Erro ao criar usuário" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "Usuário não existe" });

  const match = await bcrypt.compare(senha, user.senha);
  if (!match) return res.status(400).json({ error: "Usuário/Senha incorretos!" });

  const token = jwt.sign(
    { id: user.id, nome: user.nome, role: user.role },
    SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// Criar ocorrência
app.post("/ocorrencias", auth, async (req, res) => {
  const { local, tipo, descricao, urgencia } = req.body;

  const ocorrencia = await prisma.ocorrencia.create({
    data: {
      local,
      tipo,
      descricao,
      urgencia,
      criadoPor: req.user.id,
    },
  });

  res.json(ocorrencia);
});

// Listar todas as ocorrências
app.get("/ocorrencias", auth, async (req, res) => {
  const lista = await prisma.ocorrencia.findMany();
  res.json(lista);
});

// Criar voluntário (opcionalmente ligado a uma ocorrência)
app.post("/voluntarios", auth, async (req, res) => {
  const { nome, telefone, area, ocorrenciaId } = req.body;

  try {
    const data = { nome, telefone, area };

    if (ocorrenciaId) {
      data.ocorrenciaId = ocorrenciaId; // inteiro
    }

    const v = await prisma.voluntario.create({
      data,
      include: { ocorrencia: true },
    });

    return res.status(201).json(v);
  } catch (err) {
    console.error("ERRO AO CRIAR VOLUNTÁRIO:", err);
    return res
      .status(400)
      .json({ error: err.message || "Erro ao criar voluntário" });
  }
});

// Listar voluntários (já trazendo a ocorrência associada)
app.get("/voluntarios", auth, async (req, res) => {
  try {
    const lista = await prisma.voluntario.findMany({
      include: { ocorrencia: true },
    });
    return res.json(lista);
  } catch (err) {
    console.error("ERRO AO LISTAR VOLUNTÁRIOS:", err);
    return res
      .status(500)
      .json({ error: err.message || "Erro ao listar voluntários" });
  }
});


// Painel admin
app.get("/admin/ocorrencias", auth, admin, async (req, res) => {
  const lista = await prisma.ocorrencia.findMany();
  res.json(lista);
});

app.listen(3000, () => console.log("API rodando na porta 3000 🚀"));
