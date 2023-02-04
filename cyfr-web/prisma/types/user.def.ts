import { Fan, Follow, Like, Post, User } from "./../prismaContext"

export type UserFeed = User & {
  posts: Post[]
  likes: Like[]
  following: Follow[]
  follower: Follow[]
  fans: Fan[]
  fanOf: Fan[]
}

export type UserDetail = User & {
  posts: Post[]
  likes: Like[]
  following: Follow[]
  follower: Follow[]
  fans: Fan[]
  fanOf: Fan[]
}

export const UserDetailInclude = {
    posts: {
      include: {
        post_comments: {
          include: {
            author: true,
          }
        },
        shares: {
          include: {
            author: true
          }
        },
        likes: {
          include: {
            author: true
          }
        }
      },
    },
    likes: true,
    following: {
      include: {
        following: true
      }
    },
    follower: { 
      include: {
        follower: true
      }
    },
    fanOf: {
      include: {
        fanOf: true
      }
    },
    fans:  {
      include: {
        fanOf: true
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