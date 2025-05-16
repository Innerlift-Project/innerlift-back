-- CreateEnum
CREATE TYPE "SupportLevelEnum" AS ENUM ('Level_One', 'Level_Two', 'Level_Three');

-- CreateEnum
CREATE TYPE "PronounsEnum" AS ENUM ('He_Him', 'She_Her', 'They_Them', 'Other', 'Prefer_Not_To_Say');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "supportLevel" "SupportLevelEnum",
    "pronouns" "PronounsEnum",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bio" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
