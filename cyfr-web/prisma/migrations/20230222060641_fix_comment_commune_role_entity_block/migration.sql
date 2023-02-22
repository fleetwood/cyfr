-- RenameForeignKey
ALTER TABLE "Block" RENAME CONSTRAINT "FK_comment_block" TO "FK_thread_block";

-- RenameForeignKey
ALTER TABLE "Block" RENAME CONSTRAINT "FK_user_block" TO "FK_user_is_blocked";
