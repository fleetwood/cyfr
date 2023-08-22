/*
  Warnings:

  - You are about to drop the column `sharePostId` on the `Share` table. All the data in the column will be lost.
  - You are about to drop the column `visible` on the `Share` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[attachingPostId]` on the table `Share` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `attachingPostId` to the `Share` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Share" DROP CONSTRAINT "Share_sharePostId_fkey";

-- DropIndex
DROP INDEX "Share_sharePostId_key";

-- AlterTable
ALTER TABLE "Share" DROP COLUMN "sharePostId",
DROP COLUMN "visible",
ADD COLUMN     "agentId" TEXT,
ADD COLUMN     "attachingPostId" TEXT NOT NULL,
ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "publisherId" TEXT,
ADD COLUMN     "reviewId" TEXT,
ADD COLUMN     "submissionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Share_attachingPostId_key" ON "Share"("attachingPostId");

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_attachingPostId_fkey" FOREIGN KEY ("attachingPostId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;
