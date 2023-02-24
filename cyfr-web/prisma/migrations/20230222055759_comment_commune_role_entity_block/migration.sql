-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BLOCKED', 'PUBLIC', 'PRIVATE', 'READONLY', 'COMMENTONLY', 'CONTRIBUTOR', 'ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "Entity" AS ENUM ('INBOX', 'GALLERY', 'POST', 'ARTICLE', 'BOOK', 'CHARACTER', 'USER');

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "commentId" TEXT;

-- CreateTable
CREATE TABLE "CommentThread" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entity" "Entity" NOT NULL,
    "requiredRole" "Role" NOT NULL DEFAULT 'PUBLIC',

    CONSTRAINT "CommentThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "threadType" "Entity" NOT NULL,
    "threadId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commune" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    "entity" "Entity" NOT NULL,
    "entityId" TEXT NOT NULL,

    CONSTRAINT "Commune_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommuneUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "communeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'READONLY',

    CONSTRAINT "CommuneUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entity" "Entity",
    "entityId" TEXT,
    "blockedId" TEXT NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Commune_entityId_key" ON "Commune"("entityId");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "CommentThread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commune" ADD CONSTRAINT "FK_gallery_commune" FOREIGN KEY ("entityId") REFERENCES "Gallery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commune" ADD CONSTRAINT "FK_thread_commune" FOREIGN KEY ("entityId") REFERENCES "CommentThread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commune" ADD CONSTRAINT "Commune_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommuneUser" ADD CONSTRAINT "CommuneUser_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "Commune"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommuneUser" ADD CONSTRAINT "CommuneUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "FK_comment_block" FOREIGN KEY ("entityId") REFERENCES "CommentThread"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "FK_gallery_block" FOREIGN KEY ("entityId") REFERENCES "Gallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "FK_user_block" FOREIGN KEY ("entityId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
