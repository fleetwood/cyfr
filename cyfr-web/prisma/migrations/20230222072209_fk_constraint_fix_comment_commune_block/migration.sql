/*
  Warnings:

  - You are about to drop the column `entityId` on the `Commune` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[galleryId]` on the table `Commune` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[threadId]` on the table `Commune` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Block` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "FK_gallery_block";

-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "FK_thread_block";

-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "FK_user_is_blocked";

-- DropForeignKey
ALTER TABLE "Commune" DROP CONSTRAINT "FK_gallery_commune";

-- DropForeignKey
ALTER TABLE "Commune" DROP CONSTRAINT "FK_thread_commune";

-- DropIndex
DROP INDEX "Commune_entityId_key";

-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "galleryId" TEXT,
ADD COLUMN     "threadId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Commune" DROP COLUMN "entityId",
ADD COLUMN     "galleryId" TEXT,
ADD COLUMN     "threadId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Commune_galleryId_key" ON "Commune"("galleryId");

-- CreateIndex
CREATE UNIQUE INDEX "Commune_threadId_key" ON "Commune"("threadId");

-- AddForeignKey
ALTER TABLE "Commune" ADD CONSTRAINT "Commune_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commune" ADD CONSTRAINT "Commune_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "CommentThread"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "CommentThread"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
