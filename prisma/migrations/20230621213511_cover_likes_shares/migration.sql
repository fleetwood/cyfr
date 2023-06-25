/*
  Warnings:

  - You are about to drop the column `height` on the `Cover` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Cover` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Cover` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cover" DROP COLUMN "height",
DROP COLUMN "title",
DROP COLUMN "width",
ADD COLUMN     "exclusive" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "coverId" TEXT;

-- AlterTable
ALTER TABLE "Share" ADD COLUMN     "coverId" TEXT;

-- AddForeignKey
ALTER TABLE "Cover" ADD CONSTRAINT "Cover_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_coverId_fkey" FOREIGN KEY ("coverId") REFERENCES "Cover"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_coverId_fkey" FOREIGN KEY ("coverId") REFERENCES "Cover"("id") ON DELETE SET NULL ON UPDATE CASCADE;
