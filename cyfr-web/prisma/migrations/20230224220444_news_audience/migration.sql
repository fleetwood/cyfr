-- CreateEnum
CREATE TYPE "Audience" AS ENUM ('PUBLIC', 'USER', 'MEMBER', 'MEMBER_EXP', 'AGENT', 'AGENT_EXP');

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "banner" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "postId" TEXT NOT NULL,
    "audience" "Audience" NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "News_postId_key" ON "News"("postId");

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
