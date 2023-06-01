import { BookStub, Follow, Gallery, GalleryStub, Image, Membership, Post, PostStub, User } from "./../prismaContext"

export type UserFeed = User & {
  _count:       { sessions: number }
  membership?:  Membership
  posts:        Post[]
  follows:      Follow[]
  followers:    Follow[]
}

export const UserFeedInclude = {
  membership: true,
  posts: true,
  likes: true,
  following: true,
  follower: true,
  _count: {
    select: {
      sessions: true
    }
  }
}

export type UserDetail = User & {
  membership?:  Membership,
  posts:        PostStub[]
  canMessage:   UserStub[]
  follows:      UserFollow[]
  followers:    UserFollow[]
  galleries:    GalleryStub[]
  books:        BookStub[]
}

export type CyfrUser = UserDetail & {
  postCount:      Number
  followerCount:  Number
  fanCount:       Number
  followCount:    Number
  stanCount:      Number
}

export type UserStub = {
  id:     string
  name:   string
  image:  string
}

/**
 * NOTE! Use a `select` instead of `include`
 * @returns {
 *  id: String
 *  name: String
 *  email: String
 *  image: String (url)
 * }
 */
export const UserStubSelect = {
  id: true,
  name: true,
  email: true,
  image: true
}

/**
 * NOTE! Use a `select` instead of `include`
 * @property id: String
 * @property name: String
 * @property email: String
 * @property image: String (url)
 * @property isFan: Boolean | null
 */
export type UserFollow = UserStub & {
  isFan?: boolean
}

export type UserEngageProps = {
  followerId:   String
  followingId:  String
  isFan?:       Boolean
  active?:      Boolean
}