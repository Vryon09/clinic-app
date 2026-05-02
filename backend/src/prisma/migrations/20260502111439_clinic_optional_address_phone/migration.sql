/*
  Warnings:

  - You are about to drop the column `contactNumber` on the `Clinic` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Clinic" DROP COLUMN "contactNumber",
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "address" DROP NOT NULL;
