import { Fan, Follow, Like, Post, PostFeed, Share, User, Image, Gallery } from "./../prismaContext"
import { GalleryFeed, GalleryFeedInclude } from './gallery.def';
import { PostFeedInclude } from "./post.def"

export type UserFeed = User & {
  _count: {
    sessions: number
  }
  posts: Post[]
  likes: Like[]
  following: Follow[]
  follower: Follow[]
  fans: Fan[]
  fanOf: Fan[]
}

export const UserFeedInclude = {
  posts: true,
  likes: true,
  following: true,
  follower: true,
  fans: true,
  fanOf: true,
  _count: {
    sessions: true,
  }
}

export type UserDetail = User & {
  _count: {
    likes: number
    shares: number
    sessions: number
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
        sessions: true,
        shares: true
      }
    },
    posts: {
      include: {
        author: true,
        comment: true,
        images: true,
        post_comments: { include: { author: true } },
        likes: { include: { author: true } },
        shares: { include: { author: true } },
      }
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