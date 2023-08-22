-- AlterTable
ALTER TABLE "MembershipType" ADD COLUMN     "annualDescription" TEXT NOT NULL DEFAULT 'No description',
ADD COLUMN     "annualPrice" INTEGER NOT NULL DEFAULT -1,
ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'No description',
ADD COLUMN     "monthlyDescription" TEXT NOT NULL DEFAULT 'No description',
ADD COLUMN     "monthlyPrice" INTEGER NOT NULL DEFAULT -1,
ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "level" SET DEFAULT -1,
ALTER COLUMN "name" SET DEFAULT 'Need a name';
