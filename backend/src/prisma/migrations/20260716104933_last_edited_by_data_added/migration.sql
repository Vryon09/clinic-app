-- AlterTable
ALTER TABLE "Clinic" ADD COLUMN     "lastEditedById" TEXT;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "lastEditedById" TEXT;

-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "lastEditedById" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastEditedById" TEXT;

-- AddForeignKey
ALTER TABLE "Clinic" ADD CONSTRAINT "Clinic_lastEditedById_fkey" FOREIGN KEY ("lastEditedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_lastEditedById_fkey" FOREIGN KEY ("lastEditedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_lastEditedById_fkey" FOREIGN KEY ("lastEditedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_lastEditedById_fkey" FOREIGN KEY ("lastEditedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
