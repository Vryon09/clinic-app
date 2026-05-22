/*
  Warnings:

  - You are about to drop the column `isArchive` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `isArchive` on the `Record` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "isArchive",
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Record" DROP COLUMN "isArchive",
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;
