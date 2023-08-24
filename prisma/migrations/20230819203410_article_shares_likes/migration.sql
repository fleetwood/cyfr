-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "articleId" TEXT;

-- AlterTable
ALTER TABLE "Share" ADD COLUMN     "articleId" TEXT;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "News"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "News"("id") ON DELETE SET NULL ON UPDATE CASCADE;
