-- DropForeignKey
ALTER TABLE "Case" DROP CONSTRAINT "Case_doctorId_fkey";

-- AlterTable
ALTER TABLE "Case" ALTER COLUMN "doctorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
