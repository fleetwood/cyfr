-- AlterTable
ALTER TABLE "News" ADD COLUMN     "creatorId" TEXT,
ADD COLUMN     "hook" TEXT;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
