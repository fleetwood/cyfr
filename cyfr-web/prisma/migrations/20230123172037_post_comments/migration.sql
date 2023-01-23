-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "commentId" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
