-- DropForeignKey
ALTER TABLE "Gallery" DROP CONSTRAINT "Gallery_id_fkey";

-- AlterTable
ALTER TABLE "Gallery" ADD COLUMN     "shareId" TEXT;

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "postId" TEXT;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
