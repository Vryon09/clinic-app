-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "archivedOn" TIMESTAMP(3),
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;
