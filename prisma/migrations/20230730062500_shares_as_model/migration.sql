/*
  Warnings:

  - You are about to drop the column `bookId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `characterId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `coverId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `galleryId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_characterId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_coverId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_galleryId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_imageId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_postId_fkey";

-- DropIndex
DROP INDEX "Post_postId_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "bookId",
DROP COLUMN "characterId",
DROP COLUMN "coverId",
DROP COLUMN "galleryId",
DROP COLUMN "imageId",
DROP COLUMN "postId";

-- CreateTable
CREATE TABLE "Share" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "creatorId" TEXT NOT NULL,
    "sharePostId" TEXT NOT NULL,
    "postId" TEXT,
    "imageId" TEXT,
    "galleryId" TEXT,
    "bookId" TEXT,
    "characterId" TEXT,
    "coverId" TEXT,
    "eventId" TEXT,

    CONSTRAINT "Share_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Share_sharePostId_key" ON "Share"("sharePostId");

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_sharePostId_fkey" FOREIGN KEY ("sharePostId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_coverId_fkey" FOREIGN KEY ("coverId") REFERENCES "Cover"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
