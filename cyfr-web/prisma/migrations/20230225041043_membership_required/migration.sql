/*
  Warnings:

  - You are about to drop the column `userId` on the `Membership` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[membershipId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `membershipId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_userId_fkey";

-- DropIndex
DROP INDEX "Membership_userId_key";

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "membershipId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_membershipId_key" ON "User"("membershipId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
