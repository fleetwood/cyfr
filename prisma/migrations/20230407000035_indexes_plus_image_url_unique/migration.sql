/*
  Warnings:

  - You are about to drop the column `entity` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `entityId` on the `Block` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blockType` to the `Block` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('BOOK', 'GALLERY', 'THREAD', 'USER', 'SITE');

-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_blockedId_fkey";

-- AlterTable
ALTER TABLE "Block" DROP COLUMN "entity",
DROP COLUMN "entityId",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "blockType" "BlockType" NOT NULL,
ADD COLUMN     "expiresAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "expiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Block_id_userId_authorId_threadId_blockType_idx" ON "Block"("id", "userId", "authorId", "threadId", "blockType");

-- CreateIndex
CREATE INDEX "Follow_id_followerId_followingId_idx" ON "Follow"("id", "followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_url_key" ON "Image"("url");

-- CreateIndex
CREATE INDEX "Like_id_authorId_postId_idx" ON "Like"("id", "authorId", "postId");

-- CreateIndex
CREATE INDEX "Membership_id_idx" ON "Membership"("id");

-- CreateIndex
CREATE INDEX "Post_id_authorId_shareId_visible_createdAt_idx" ON "Post"("id", "authorId", "shareId", "visible", "createdAt");

-- CreateIndex
CREATE INDEX "Share_id_authorId_postId_idx" ON "Share"("id", "authorId", "postId");

-- CreateIndex
CREATE INDEX "User_id_name_email_idx" ON "User"("id", "name", "email");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
