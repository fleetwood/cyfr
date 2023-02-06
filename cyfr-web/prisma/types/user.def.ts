import { Fan, Follow, Like, Post, PostFeed, Share, User } from "./../prismaContext"
import { PostFeedInclude } from "./post.def"

export type UserFeed = User & {
  posts: Post[]
  likes: Like[]
  following: Follow[]
  follower: Follow[]
  fans: Fan[]
  fanOf: Fan[]
}

export type UserDetail = User & {
  _count: {
    likes: number
    shares: number
  }
  posts: PostFeed[]
  following: { follower: User }[]
  follower: { following: User }[]
  fanOf: { fanOf: User }[]
  fans: { fan: User }[]
}

export const UserDetailInclude = {
    _count: {
      select: {
        likes: true,
        shares: true
      }
    },
    posts: {
      include: PostFeedInclude
    },
    following: {
      select: {
        follower: true
      }
    },
    follower: { 
      select: {
        following: true
      }
    },
    fanOf: {
      select: {
        fanOf: true
      }
    },
    fans:  {
      select: {
        fan: true
      }
    }
}

export type CyfrUser = User & {
  posts: Post[]
  likes: Like[]
  following: Follow[]
  follower: Follow[]
  fans: Fan[]
  fanOf: Fan[]
}