-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "title" VARCHAR(255) NOT NULL,
    "subtitle" VARCHAR(255),
    "headerImage" VARCHAR(255),
    "content" TEXT NOT NULL,
    "authorid" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_post_thread" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_post_thread_AB_unique" ON "_post_thread"("A", "B");

-- CreateIndex
CREATE INDEX "_post_thread_B_index" ON "_post_thread"("B");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_post_thread" ADD CONSTRAINT "_post_thread_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_post_thread" ADD CONSTRAINT "_post_thread_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
