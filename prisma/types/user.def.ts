import { BookStub, Follow, Gallery, GalleryStub, Image, Membership, Post, PostStub, User } from "./../prismaContext"

/**
 * This is complaining if imported from Post.defs that it can't be
 * accessed before initialization. Prolly a different issues, but
 * this will work for now.
 */
const PostFeedInclude = {
  author:         true,
  comment:        true,
  images:         true,
  post_comments:  { include: { author: true } },
  likes:          { include: { author: true } },
  shares:         { include: { author: true } },
}

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
  messagable:   UserStub[]
  canMention:   UserStub[]
  follows:      UserFollow[]
  followers:    UserFollow[]
  images:       (Image & { _count: { likes: number, shares: number}})[]
  galleries:    GalleryStub[]
  books:        BookStub[]
}

export const UserDetailInclude = {
    _count: {
      select: {
        likes: true,
        sessions: true,
        shares: true
      }
    },
    membership: true,
    posts: {
      include: PostFeedInclude
    },
    books: true,
    images: {
      include: {
        _count: { 
          select: {
            likes: true,
            shares: true,
          }
        }
    }},
    galleries: {
      include: {
        images: {
          include: {
            _count: {
              select: {
              likes: true,
              shares: true
            }}
          }
        },
        likes: true,
        shares: true,
      }
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
    }
}

export type CyfrUser = UserDetail & {
  
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

export const UserFollowSelect = {
  ...UserStubSelect,
  isFan: true
}