-- AlterTable
ALTER TABLE "Share" ADD COLUMN     "bookId" TEXT,
ADD COLUMN     "characterId" TEXT;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;
