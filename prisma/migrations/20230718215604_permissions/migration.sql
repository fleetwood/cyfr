/*
  Warnings:

  - The values [VIEW,REVIEW,EDIT] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `requiredRole` on the `CommentThread` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `CommuneUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[permissionId]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[permissionId]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[permissionId]` on the table `Character` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[permissionId]` on the table `Commune` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[permissionId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[permissionId]` on the table `Gallery` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('BLOCKED', 'NONE', 'READ', 'COMMENT', 'FEEDBACK', 'OWNER', 'ADMIN');
ALTER TABLE "CommentThread" ALTER COLUMN "requiredRole" DROP DEFAULT;
ALTER TABLE "CommuneUser" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Permission" ALTER COLUMN "public" TYPE "Role_new"[] USING ("public"::text::"Role_new"[]);
ALTER TABLE "Permission" ALTER COLUMN "member" TYPE "Role_new"[] USING ("member"::text::"Role_new"[]);
ALTER TABLE "Permission" ALTER COLUMN "reader" TYPE "Role_new"[] USING ("reader"::text::"Role_new"[]);
ALTER TABLE "Permission" ALTER COLUMN "editor" TYPE "Role_new"[] USING ("editor"::text::"Role_new"[]);
ALTER TABLE "Permission" ALTER COLUMN "author" TYPE "Role_new"[] USING ("author"::text::"Role_new"[]);
ALTER TABLE "Permission" ALTER COLUMN "artist" TYPE "Role_new"[] USING ("artist"::text::"Role_new"[]);
ALTER TABLE "Permission" ALTER COLUMN "agent" TYPE "Role_new"[] USING ("agent"::text::"Role_new"[]);
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "permissionId" TEXT;

-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "permissionId" TEXT;

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "permissionId" TEXT;

-- AlterTable
ALTER TABLE "CommentThread" DROP COLUMN "requiredRole";

-- AlterTable
ALTER TABLE "Commune" ADD COLUMN     "permissionId" TEXT;

-- AlterTable
ALTER TABLE "CommuneUser" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "permissionId" TEXT;

-- AlterTable
ALTER TABLE "Gallery" ADD COLUMN     "permissionId" TEXT;

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "public" "Role"[] DEFAULT ARRAY['NONE']::"Role"[],
    "member" "Role"[] DEFAULT ARRAY['NONE']::"Role"[],
    "reader" "Role"[] DEFAULT ARRAY['NONE']::"Role"[],
    "editor" "Role"[] DEFAULT ARRAY['NONE']::"Role"[],
    "author" "Role"[] DEFAULT ARRAY['NONE']::"Role"[],
    "artist" "Role"[] DEFAULT ARRAY['NONE']::"Role"[],
    "agent" "Role"[] DEFAULT ARRAY['NONE']::"Role"[],

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_permissionId_key" ON "Book"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_permissionId_key" ON "Chapter"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Character_permissionId_key" ON "Character"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Commune_permissionId_key" ON "Commune"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_permissionId_key" ON "Event"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Gallery_permissionId_key" ON "Gallery"("permissionId");

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commune" ADD CONSTRAINT "Commune_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
