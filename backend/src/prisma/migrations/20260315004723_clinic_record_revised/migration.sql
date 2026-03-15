/*
  Warnings:

  - You are about to drop the column `bloodPressure` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `medications` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Record` table. All the data in the column will be lost.
  - Made the column `middleName` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "middleName" SET NOT NULL;

-- AlterTable
ALTER TABLE "Record" DROP COLUMN "bloodPressure",
DROP COLUMN "medications",
DROP COLUMN "temperature",
DROP COLUMN "weight";

-- CreateTable
CREATE TABLE "VitalSigns" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "bloodPressureSystolic" INTEGER,
    "bloodPressureDiastolic" INTEGER,
    "temperature" DECIMAL(4,1),
    "weightKg" DECIMAL(5,2),

    CONSTRAINT "VitalSigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecordMedication" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "durationDays" INTEGER,
    "instructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecordMedication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VitalSigns_recordId_key" ON "VitalSigns"("recordId");

-- AddForeignKey
ALTER TABLE "VitalSigns" ADD CONSTRAINT "VitalSigns_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordMedication" ADD CONSTRAINT "RecordMedication_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
