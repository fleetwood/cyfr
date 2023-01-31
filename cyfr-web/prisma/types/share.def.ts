import { Post, Share, User } from "@prisma/client"

export type ShareItem = Share & {
  author: User
  post?: Post
}
export const ShareItemInclude = {
  author: true,
  post: true,
}
