import { Book, Follow, GalleryFeed, Image, Like, Membership, Post, PostFeed, User } from "./../prismaContext"

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
  likes:        Like[]
  following:    Follow[]
  follower:     Follow[]
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
  _count: {
    likes:    number
    shares:   number
    sessions: number
  }
  membership?:  Membership,
  posts:        PostFeed[]
  books:        Book[]
  following:    { follower: User }[]
  follower:     { following: User }[]
  images:       (Image & { _count: { likes: number, shares: number}})[]
  galleries:    GalleryFeed[]
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

export type CyfrUser = User & {
  _count: {
    likes:    number
    shares:   number
    sessions: number
  }
  membership?:  Membership,
  posts:        PostFeed[]
  // books: Book[]
  messagable:   UserProps[]
  following:    UserProps[]
  follower:     UserProps[]
  images:       (Image & { _count: { likes: number, shares: number}})[]
  galleries:    GalleryFeed[]
}

export const CyfrUserInclude = {
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

export type UserProps = {
  id:     string
  name:   string
  image:  string
}