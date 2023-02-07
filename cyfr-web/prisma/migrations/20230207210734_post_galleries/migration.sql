/*
  Warnings:

  - You are about to drop the column `shareId` on the `Gallery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Gallery" DROP COLUMN "shareId";

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_id_fkey" FOREIGN KEY ("id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
