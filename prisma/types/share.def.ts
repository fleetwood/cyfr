import { PostFeed, Share, User } from "./../prismaContext"

export type ShareDeleteProps = {
  id: string
  authorId: string
}

export type ShareFeed = Share & {
  createdat?: string
  updatedat?: string
  author: User
  post?: PostFeed | null
}