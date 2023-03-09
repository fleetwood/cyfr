/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Genre` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Genre_title_key" ON "Genre"("title");
