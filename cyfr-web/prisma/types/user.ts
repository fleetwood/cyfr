import { Fan, Follow, Post, User } from "@prisma/client"
import { ResponseResult } from "../../types/response"
import { PostWithDetails } from "./post"

export type FollowProps = {
  following: string
  follower: string
}

export type FanProps = {
  fanId: string
  fanOfId: string
}

export type UsersResponse = ResponseResult<User[]>
export type UserResponse = ResponseResult<User>
export type UserWithPostsLikes = User & {
  posts: Post[]
  likes: Post[]
}

export type UserFollows = Follow & {
  following: User
  follower: User
}

export type UserFans = Fan & {
  fan: User
  fanOf: User
}

export type UserDetail = User & {
  posts: PostWithDetails[]
  likes: Post[]
  following: UserFollows[]
  follower: UserFollows[]
  fans: UserFans[]
  fanOf: UserFans[]
}
