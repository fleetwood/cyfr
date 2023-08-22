-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "artist" "Role"[],
ADD COLUMN     "author" "Role"[],
ADD COLUMN     "editor" "Role"[],
ADD COLUMN     "following" "Role"[],
ADD COLUMN     "stan" "Role"[];
