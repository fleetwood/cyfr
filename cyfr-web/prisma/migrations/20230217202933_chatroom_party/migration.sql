/*
  Warnings:

  - A unique constraint covering the columns `[party]` on the table `ChatRoom` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `party` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "party" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_party_key" ON "ChatRoom"("party");
