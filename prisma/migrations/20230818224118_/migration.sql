/*
  Warnings:

  - A unique constraint covering the columns `[reviewId]` on the table `News` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "News_content_key";

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "reviewId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "News_reviewId_key" ON "News"("reviewId");

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;
