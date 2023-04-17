import { Like, Post, User } from "./../prismaContext"

export type LikeProps = {
  authorId:     String
  postId?:      String
  galleryId?:   String
  imageId?:     String
  commentId?:   String
  characterId?: String
  bookId?:      String
}

export type ShareWithAuthorPost = Like & {
  author: User
  post?: Post
}
export const ShareWithAuthorPostInclude = {
  author: true,
  post: true,
}
