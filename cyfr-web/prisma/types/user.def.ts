import { Fan, Follow, Like, Post, User } from "@prisma/client"

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

export type CyfrUser = User & {
  posts: Post[]
  likes: Like[]
  following: Follow[]
  follower: Follow[]
  fans: Fan[]
  fanOf: Fan[]
}