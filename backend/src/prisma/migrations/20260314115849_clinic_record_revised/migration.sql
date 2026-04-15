/*
  Warnings:

  - You are about to drop the column `chiefComplaint` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Record` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Record" DROP COLUMN "chiefComplaint",
DROP COLUMN "notes",
ADD COLUMN     "bloodPressure" TEXT,
ADD COLUMN     "medications" TEXT,
ADD COLUMN     "signs" TEXT,
ADD COLUMN     "symptoms" TEXT,
ADD COLUMN     "temperature" TEXT,
ADD COLUMN     "weight" INTEGER;
