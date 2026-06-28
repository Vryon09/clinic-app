/*
  Warnings:

  - You are about to drop the column `doctorId` on the `Record` table. All the data in the column will be lost.
  - Added the required column `doctorId` to the `Case` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_doctorId_fkey";

-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "doctorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Record" DROP COLUMN "doctorId";

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
