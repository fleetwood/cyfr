-- CreateTable
CREATE TABLE "_user_likes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_user_likes_AB_unique" ON "_user_likes"("A", "B");

-- CreateIndex
CREATE INDEX "_user_likes_B_index" ON "_user_likes"("B");

-- AddForeignKey
ALTER TABLE "_user_likes" ADD CONSTRAINT "_user_likes_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_likes" ADD CONSTRAINT "_user_likes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
