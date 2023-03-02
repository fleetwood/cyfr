/*
  Warnings:

  - The values [PUBLIC,PRIVATE,READONLY,COMMENTONLY,CONTRIBUTOR] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('PRIVATE', 'DRAFT', 'MANUSCRIPT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'READERS', 'MEMBERS', 'AGENTS', 'GROUP');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('BLOCKED', 'VIEW', 'COMMENT', 'REVIEW', 'EDIT', 'ADMIN', 'OWNER');
ALTER TABLE "CommuneUser" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "CommentThread" ALTER COLUMN "requiredRole" DROP DEFAULT;
ALTER TABLE "CommentThread" ALTER COLUMN "requiredRole" TYPE "Role_new" USING ("requiredRole"::text::"Role_new");
ALTER TABLE "CommuneUser" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "CommuneUser" ALTER COLUMN "role" SET DEFAULT 'VIEW';
ALTER TABLE "CommentThread" ALTER COLUMN "requiredRole" SET DEFAULT 'VIEW';
COMMIT;

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followingId_fkey";

-- AlterTable
ALTER TABLE "CommentThread" ALTER COLUMN "requiredRole" SET DEFAULT 'VIEW';

-- AlterTable
ALTER TABLE "CommuneUser" ALTER COLUMN "role" SET DEFAULT 'VIEW';

-- AlterTable
ALTER TABLE "Follow" ADD COLUMN     "bookId" TEXT,
ADD COLUMN     "characterId" TEXT,
ALTER COLUMN "followingId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "bookId" TEXT,
ADD COLUMN     "characterId" TEXT;

-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookCategory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "BookCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "status" "BookStatus" DEFAULT 'PRIVATE',
    "prospect" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "cover" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,
    "hook" TEXT,
    "synopsis" TEXT,
    "back" TEXT,
    "galleryId" TEXT,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "givenName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "backstory" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "archetype" TEXT NOT NULL,
    "galleryId" TEXT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "content" TEXT NOT NULL DEFAULT '',
    "bookId" TEXT NOT NULL,
    "galleryId" TEXT,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_book_categories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_user_books" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_book_characters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_chapter_characters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_galleryId_key" ON "Book"("galleryId");

-- CreateIndex
CREATE UNIQUE INDEX "Character_galleryId_key" ON "Character"("galleryId");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_galleryId_key" ON "Chapter"("galleryId");

-- CreateIndex
CREATE UNIQUE INDEX "_book_categories_AB_unique" ON "_book_categories"("A", "B");

-- CreateIndex
CREATE INDEX "_book_categories_B_index" ON "_book_categories"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_user_books_AB_unique" ON "_user_books"("A", "B");

-- CreateIndex
CREATE INDEX "_user_books_B_index" ON "_user_books"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_book_characters_AB_unique" ON "_book_characters"("A", "B");

-- CreateIndex
CREATE INDEX "_book_characters_B_index" ON "_book_characters"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_chapter_characters_AB_unique" ON "_chapter_characters"("A", "B");

-- CreateIndex
CREATE INDEX "_chapter_characters_B_index" ON "_chapter_characters"("B");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_book_categories" ADD CONSTRAINT "_book_categories_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_book_categories" ADD CONSTRAINT "_book_categories_B_fkey" FOREIGN KEY ("B") REFERENCES "BookCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_books" ADD CONSTRAINT "_user_books_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_books" ADD CONSTRAINT "_user_books_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_book_characters" ADD CONSTRAINT "_book_characters_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_book_characters" ADD CONSTRAINT "_book_characters_B_fkey" FOREIGN KEY ("B") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chapter_characters" ADD CONSTRAINT "_chapter_characters_A_fkey" FOREIGN KEY ("A") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chapter_characters" ADD CONSTRAINT "_chapter_characters_B_fkey" FOREIGN KEY ("B") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
