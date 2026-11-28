-- CreateTable
CREATE TABLE IF NOT EXISTS "MedicalCertificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT,
    "templateType" TEXT NOT NULL DEFAULT 'GENERAL_CLEARANCE',
    "certificateDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateSeen" DATETIME,
    "reasonForVisit" TEXT,
    "vitalSigns" TEXT,
    "physicalExam" TEXT,
    "labResults" TEXT,
    "fitnessClass" TEXT,
    "diagnosis" TEXT,
    "remarks" TEXT,
    "purpose" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MedicalCertificate_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MedicalCertificate_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "MedicalCertificate_patientId_idx" ON "MedicalCertificate"("patientId");
CREATE INDEX IF NOT EXISTS "MedicalCertificate_doctorId_idx" ON "MedicalCertificate"("doctorId");
