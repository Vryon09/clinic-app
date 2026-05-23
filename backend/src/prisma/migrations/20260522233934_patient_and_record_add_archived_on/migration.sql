-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "archivedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "archivedOn" TIMESTAMP(3);
