import { Fan, Follow, Like, Post, PostFeed, Share, User, Image, Gallery } from "./../prismaContext"
import { GalleryFeed } from "./gallery.def"
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
  images: (Image & { _count: { likes: number, shares: number}})[]
  galleries: (GalleryFeed)[]
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
        images: true,
        likes: {include: {author: true}},
        shares: {include: {author: true}},
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