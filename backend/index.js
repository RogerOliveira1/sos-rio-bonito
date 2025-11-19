const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.use(cors());
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
    res.status(400).json({ error: "Email já cadastrado" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "Usuário não existe" });

  const match = await bcrypt.compare(senha, user.senha);
  if (!match) return res.status(400).json({ error: "Senha incorreta" });

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

// Criar voluntário
app.post("/voluntarios", auth, async (req, res) => {
  const { nome, telefone, area } = req.body;
  const v = await prisma.voluntario.create({
    data: { nome, telefone, area },
  });
  res.json(v);
});

// Listar voluntários
app.get("/voluntarios", auth, async (req, res) => {
  const lista = await prisma.voluntario.findMany();
  res.json(lista);
});

// Painel admin
app.get("/admin/ocorrencias", auth, admin, async (req, res) => {
  const lista = await prisma.ocorrencia.findMany();
  res.json(lista);
});

app.listen(3000, () => console.log("API rodando na porta 3000 🚀"));
