/*
  Warnings:

  - You are about to drop the column `shareId` on the `Gallery` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[commentThreadId]` on the table `Gallery` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Gallery" DROP COLUMN "shareId",
ADD COLUMN     "commentThreadId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Gallery_commentThreadId_key" ON "Gallery"("commentThreadId");

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_commentThreadId_fkey" FOREIGN KEY ("commentThreadId") REFERENCES "CommentThread"("id") ON DELETE SET NULL ON UPDATE CASCADE;
