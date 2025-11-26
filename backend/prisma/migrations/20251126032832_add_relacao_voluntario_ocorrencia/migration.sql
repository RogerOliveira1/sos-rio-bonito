/*
  Warnings:

  - Made the column `descricao` on table `Ocorrencia` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ocorrencia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "local" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "urgencia" TEXT NOT NULL,
    "criadoPor" INTEGER NOT NULL
);
INSERT INTO "new_Ocorrencia" ("criadoPor", "descricao", "id", "local", "tipo", "urgencia") SELECT "criadoPor", "descricao", "id", "local", "tipo", "urgencia" FROM "Ocorrencia";
DROP TABLE "Ocorrencia";
ALTER TABLE "new_Ocorrencia" RENAME TO "Ocorrencia";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user'
);
INSERT INTO "new_User" ("email", "id", "nome", "role", "senha") SELECT "email", "id", "nome", "role", "senha" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Voluntario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "ocorrenciaId" INTEGER,
    CONSTRAINT "Voluntario_ocorrenciaId_fkey" FOREIGN KEY ("ocorrenciaId") REFERENCES "Ocorrencia" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Voluntario" ("area", "id", "nome", "telefone") SELECT "area", "id", "nome", "telefone" FROM "Voluntario";
DROP TABLE "Voluntario";
ALTER TABLE "new_Voluntario" RENAME TO "Voluntario";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
