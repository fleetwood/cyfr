import { PostDetail, PostStub } from "prisma/types"

export const isShare = (post: PostStub | PostDetail) => post.bookId !== null || post.characterId != null || post.coverId !== null || post.galleryId !== null || post.postId !== null