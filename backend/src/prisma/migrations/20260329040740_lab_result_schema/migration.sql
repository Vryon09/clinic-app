-- CreateTable
CREATE TABLE "labResult" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "labResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "labResult" ADD CONSTRAINT "labResult_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
