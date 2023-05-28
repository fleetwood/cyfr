/*
  Warnings:

  - You are about to drop the column `coverId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `galleryId` on the `Genre` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_coverId_fkey";

-- DropForeignKey
ALTER TABLE "Genre" DROP CONSTRAINT "Genre_galleryId_fkey";

-- DropIndex
DROP INDEX "Book_coverId_key";

-- DropIndex
DROP INDEX "Genre_galleryId_key";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "coverId";

-- AlterTable
ALTER TABLE "Genre" DROP COLUMN "galleryId";

-- CreateTable
CREATE TABLE "Cover" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT,
    "authorId" TEXT NOT NULL,
    "height" INTEGER DEFAULT 0,
    "width" INTEGER DEFAULT 0,
    "bookId" TEXT,
    "imageId" TEXT NOT NULL,
    "genreId" TEXT,

    CONSTRAINT "Cover_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cover_bookId_key" ON "Cover"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "Cover_imageId_key" ON "Cover"("imageId");

-- AddForeignKey
ALTER TABLE "Cover" ADD CONSTRAINT "Cover_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cover" ADD CONSTRAINT "Cover_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cover" ADD CONSTRAINT "Cover_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;
