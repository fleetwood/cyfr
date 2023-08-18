/*
  Warnings:

  - You are about to drop the column `postId` on the `News` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "News_postId_key";

-- AlterTable
ALTER TABLE "News" DROP COLUMN "postId";
