# 🆘 SOS Rio Bonito

Sistema web para **registro de ocorrências** em situações de risco (alagamentos, deslizamentos, incêndios etc.) e **gestão de voluntários**.  
Projeto full-stack com **React + Vite** no frontend e **Node.js + Express + Prisma + SQLite** no backend, com **autenticação JWT** e controle de acesso por **perfis de usuário (user/admin)**.

---

## ✨ Funcionalidades

- 🔐 **Autenticação de usuários**
  - Login com email e senha
  - Token JWT armazenado no `localStorage`
  - Proteção de rotas no frontend e backend

- 👤 **Perfis de usuário**
  - `user` → cadastra e visualiza **apenas suas próprias ocorrências**
  - `admin` → visualiza **todas as ocorrências** e possui rotas exclusivas na API

- 📍 **Gestão de Ocorrências**
  - Cadastro de ocorrências com:
    - Local
    - Tipo (alagamento, deslizamento, incêndio, outro)
    - Descrição
    - Nível de urgência
  - Listagem filtrada por usuário ou geral (admin)
  - Exclusão de ocorrências

- 🤝 **Gestão de Voluntários**
  - Cadastro de voluntários
  - Associação de voluntários a ocorrências
  - Listagem de voluntários

- 🏗️ **Stack moderna**
  - Frontend SPA com React + Vite
  - Backend RESTful com Express
  - ORM com Prisma e banco SQLite
  - Middleware de autenticação e autorização

---

## 🧱 Tecnologias Utilizadas

**Frontend**
- React 18  
- Vite  
- React Router DOM  
- Axios  

**Backend**
- Node.js + Express  
- Prisma ORM  
- SQLite  
- JSON Web Token (JWT)  
- bcryptjs  
- dotenv  
- CORS  

---

## ⚙️ Como Rodar o Projeto
Pré-requisitos
- Node.js (versão LTS recomendada)
-npm ou yarn


## No backend
`cd backend`

# instalar dependências
`npm install`

# gerar client do Prisma (se ainda não tiver)
`npx prisma generate`

# rodar as migrações (gera/atualiza o dev.db)
`npx prisma migrate dev --name init`

# abrir o banco de dados (usado para criar usuarios ADMINS)
`npx prisma studio`

## Crie um arquivo .env na pasta do backend:
`JWT_SECRET=(senha fornecida pelos devs)`

## Inicie a API:

`npm start`
# ou
`node index.js`

---

## No Frontend
`cd frontend`

# instalar dependências
`npm install`

# rodar em ambiente de desenvolvimento
`npm run dev`

---

## 🗂️ Estrutura de Pastas (resumida)

```bash
.
├── backend/
│   ├── index.js          # API Express (rotas, auth, admin, etc.)
│   ├── schema.prisma     # Modelagem Prisma (User, Ocorrencia, Voluntario)
│   ├── dev.db            # Banco SQLite (gerado pelo Prisma)
│   └── .env              # JWT_SECRET e configs sensíveis
└── frontend/
    ├── index.html
    ├── src/
    │   ├── main.jsx
    │   ├── app.jsx
    │   ├── services/
    │   │   └── api.js           # Axios + interceptors (token + 401)
    │   └── pages/
    │       ├── LoginPage.jsx
    │       ├── OcorrenciasPage.jsx
    │       └── VoluntariosPage.jsx
    └── package.json
