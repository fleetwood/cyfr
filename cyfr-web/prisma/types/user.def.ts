import { Fan, Follow, Like, Post, PostFeed, Share, User } from "./../prismaContext"

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
  likes: Like[]
  following: { follower: User }[]
  follower: { following: User }[]
  fans: { fan: User }[]
  fanOf: { fanOf: User }[]
}

export const UserDetailInclude = {
    _count: {
      select: {
        likes: true,
        shares: true
      }
    },
    posts: {
      where: {
        visible: true,
        shareId: null,
        commentId: null
      },
      include: {
        author: {
          // counts only
          include: { _count: { select: { 
            posts: true,
            fans: true,
            fanOf: true,
            follower: true,
            following: true 
          }}}
        },
        comment: {
          include: {
            author: true
          }
        },
        post_comments: true,
        likes: true,
        shares: true
      },
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