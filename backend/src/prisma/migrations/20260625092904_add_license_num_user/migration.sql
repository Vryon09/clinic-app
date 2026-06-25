/*
  Warnings:

  - A unique constraint covering the columns `[licenseNum]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "licenseNum" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_licenseNum_key" ON "User"("licenseNum");
