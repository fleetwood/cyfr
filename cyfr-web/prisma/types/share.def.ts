import { Post, PostFeed, Share, User } from "./../prismaContext"
import { PostFeedInclude } from "./post.def"

export type ShareDeleteProps = {
  id: string
  authorId: string
}

export type ShareFeed = Share & {
  author: User
  post?: PostFeed | null
}
export const ShareItemInclude = {
  author: true,
  post: {
    include: PostFeedInclude
  },
}
