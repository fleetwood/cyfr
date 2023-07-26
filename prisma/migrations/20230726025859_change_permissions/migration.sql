/*
  Warnings:

  - You are about to drop the column `artist` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `editor` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `reader` on the `Permission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "artist",
DROP COLUMN "author",
DROP COLUMN "editor",
DROP COLUMN "reader",
ADD COLUMN     "fan" "Role"[],
ADD COLUMN     "follower" "Role"[],
ADD COLUMN     "friend" "Role"[];
