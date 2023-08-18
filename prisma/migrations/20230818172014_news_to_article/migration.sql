-- CreateEnum
CREATE TYPE "ArticleType" AS ENUM ('News', 'Article', 'Review', 'Knowledge');

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "type" "ArticleType";
