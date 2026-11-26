-- CreateTable
CREATE TABLE IF NOT EXISTS "LabRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT,
    "requestDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "selectedTests" TEXT NOT NULL,
    "customTests" TEXT,
    "otherExaminations" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LabRequest_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LabRequest_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "LabRequest_patientId_idx" ON "LabRequest"("patientId");
CREATE INDEX IF NOT EXISTS "LabRequest_doctorId_idx" ON "LabRequest"("doctorId");
