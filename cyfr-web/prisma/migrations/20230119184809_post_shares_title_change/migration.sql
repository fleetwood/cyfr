/*
  Warnings:

  - You are about to drop the column `headerImage` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `_post_thread` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_post_thread" DROP CONSTRAINT "_post_thread_A_fkey";

-- DropForeignKey
ALTER TABLE "_post_thread" DROP CONSTRAINT "_post_thread_B_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "headerImage",
DROP COLUMN "subtitle",
DROP COLUMN "title",
ADD COLUMN     "shareId" TEXT,
ALTER COLUMN "content" DROP NOT NULL;

-- DropTable
DROP TABLE "_post_thread";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
