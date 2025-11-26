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

require("dotenv").config();
const SECRET = process.env.JWT_SECRET || "dev-fallback-secret";

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
  const { nome, email, senha } = req.body;

  // validações básicas
  if (!nome || typeof nome !== "string" || nome.trim().length < 3) {
    return res.status(400).json({ error: "Nome inválido" });
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Email inválido" });
  }

  if (!senha || typeof senha !== "string" || senha.length < 4) {
    return res
      .status(400)
      .json({ error: "Senha deve ter pelo menos 4 caracteres" });
  }

  try {
    // 🔎 1) Verifica se já existe usuário com esse e-mail
    const usuarioExistente = await prisma.user.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      // se já existir, retorna 400 com mensagem clara
      return res.status(400).json({ error: "Usuário já registrado" });
    }

    // 🔐 2) Se não existir, cria normalmente
    const hash = await bcrypt.hash(senha, 10);

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha: hash,
        role: "user",
      },
    });

    const { senha: _, ...userSemSenha } = user;
    return res.status(201).json(userSemSenha);
  } catch (err) {
    console.error("ERRO AO CRIAR USUÁRIO:", err);
    return res.status(500).json({ error: "Erro interno ao criar usuário" });
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

  // VALIDAÇÃO DE ENTRADA
  if (!local || typeof local !== "string" || local.length < 3) {
    return res.status(400).json({ error: "Local inválido" });
  }

  if (!descricao || typeof descricao !== "string" || descricao.length < 5) {
    return res.status(400).json({ error: "Descrição inválida" });
  }

  const tiposPermitidos = ["alagamento", "deslizamento", "incendio", "outro"];
  if (!tiposPermitidos.includes(tipo)) {
    return res.status(400).json({ error: "Tipo de ocorrência inválido" });
  }

  const niveisUrgencia = ["baixa", "media", "alta", "critica"];
  if (!niveisUrgencia.includes(urgencia)) {
    return res.status(400).json({ error: "Nível de urgência inválido" });
  }

  try {
    const ocorrencia = await prisma.ocorrencia.create({
      data: {
        local,
        tipo,
        descricao,
        urgencia,
        criadoPor: req.user.id,
      },
    });

    return res.status(201).json(ocorrencia);
  } catch (err) {
    console.error("ERRO AO CRIAR OCORRÊNCIA:", err);
    return res.status(400).json({ error: "Erro ao criar ocorrência" });
  }
});


// Listar todas as ocorrências
app.get("/ocorrencias", auth, async (req, res) => {
  try {
    let lista;

    if (req.user.role === "admin") {
      // admin vê todas
      lista = await prisma.ocorrencia.findMany();
    } else {
      // usuário comum vê só as dele
      lista = await prisma.ocorrencia.findMany({
        where: { criadoPor: req.user.id },
      });
    }

    return res.json(lista);
  } catch (err) {
    console.error("ERRO AO LISTAR OCORRÊNCIAS:", err);
    return res.status(500).json({ error: "Erro ao listar ocorrências" });
  }
});


// Deletar ocorrência por ID
app.delete("/ocorrencias/:id", auth, async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    // Busca a ocorrência primeiro
    const oc = await prisma.ocorrencia.findUnique({ where: { id } });

    if (!oc) {
      return res.status(404).json({ error: "Ocorrência não encontrada" });
    }

    // Se o usuário não for admin e não for o criador, bloqueia
    if (req.user.role !== "admin" && oc.criadoPor !== req.user.id) {
      return res.status(403).json({ error: "Você não pode excluir essa ocorrência" });
    }

    await prisma.ocorrencia.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (err) {
    console.error("Erro ao deletar ocorrência:", err);
    return res.status(500).json({ error: "Erro ao deletar ocorrência" });
  }
});


// Criar voluntário (opcionalmente ligado a uma ocorrência)
app.post("/voluntarios", auth, async (req, res) => {
  const { nome, telefone, area, ocorrenciaId } = req.body;

  // VALIDAÇÃO DE ENTRADA
  if (!nome || typeof nome !== "string" || nome.length < 3) {
    return res.status(400).json({ error: "Nome de voluntário inválido" });
  }

  if (!telefone || typeof telefone !== "string" || telefone.length < 8) {
    return res.status(400).json({ error: "Telefone inválido" });
  }

  if (area && typeof area !== "string") {
    return res.status(400).json({ error: "Área inválida" });
  }

  let ocorrenciaIdNum = null;
  if (ocorrenciaId !== null && ocorrenciaId !== undefined && ocorrenciaId !== "") {
    ocorrenciaIdNum = Number(ocorrenciaId);
    if (Number.isNaN(ocorrenciaIdNum)) {
      return res.status(400).json({ error: "ID de ocorrência inválido" });
    }
  }

  try {
    const data = { nome, telefone, area };

    if (ocorrenciaIdNum) {
      data.ocorrenciaId = ocorrenciaIdNum;
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
