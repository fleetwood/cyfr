/*
  Warnings:

  - You are about to drop the column `starId` on the `Fan` table. All the data in the column will be lost.
  - Added the required column `fanOfId` to the `Fan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Fan" DROP CONSTRAINT "Fan_starId_fkey";

-- AlterTable
ALTER TABLE "Fan" DROP COLUMN "starId",
ADD COLUMN     "fanOfId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Fan" ADD CONSTRAINT "Fan_fanOfId_fkey" FOREIGN KEY ("fanOfId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
