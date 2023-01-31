import { Post, Share, User } from "./../prismaContext"

export type ShareItem = Share & {
  author: User
  post?: Post
}
export const ShareItemInclude = {
  author: true,
  post: true,
}
