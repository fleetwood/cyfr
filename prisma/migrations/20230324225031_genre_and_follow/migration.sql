/*
  Warnings:

  - You are about to drop the `Fan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Fan" DROP CONSTRAINT "Fan_fanId_fkey";

-- DropForeignKey
ALTER TABLE "Fan" DROP CONSTRAINT "Fan_fanOfId_fkey";

-- AlterTable
ALTER TABLE "Follow" ADD COLUMN     "isFan" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Fan";
