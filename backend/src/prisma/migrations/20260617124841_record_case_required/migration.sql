/*
  Warnings:

  - Made the column `caseId` on table `Record` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_caseId_fkey";

-- AlterTable
ALTER TABLE "Record" ALTER COLUMN "caseId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
