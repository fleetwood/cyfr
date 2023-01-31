import { Like, Post, User } from "@prisma/client"

export type ShareWithAuthorPost = Like & {
  author: User
  post?: Post
}
export const ShareWithAuthorPostInclude = {
  author: true,
  post: true
}
