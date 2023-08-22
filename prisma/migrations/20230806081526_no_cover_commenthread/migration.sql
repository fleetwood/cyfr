/*
  Warnings:

  - You are about to drop the column `commentThreadId` on the `Cover` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cover" DROP CONSTRAINT "Cover_commentThreadId_fkey";

-- DropIndex
DROP INDEX "Cover_commentThreadId_key";

-- AlterTable
ALTER TABLE "Cover" DROP COLUMN "commentThreadId";
