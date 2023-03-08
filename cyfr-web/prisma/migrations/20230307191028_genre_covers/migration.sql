-- CreateTable
CREATE TABLE "Covers" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "Covers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Covers" ADD CONSTRAINT "Covers_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
