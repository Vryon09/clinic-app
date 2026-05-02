/*
  Warnings:

  - You are about to drop the column `email` on the `Clinic` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Clinic_email_key";

-- AlterTable
ALTER TABLE "Clinic" DROP COLUMN "email";
