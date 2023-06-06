import { Book, BookStub, Cover, Follow, Gallery, GalleryStub, Image, Membership, Post, PostStub, User } from "./../prismaContext"

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

export type CyfrUser = User & {
  membership?:  Membership
  // cover?:       Cover
  // posts:        {
  //   id:         string
  //   createdAt:  string
  //   updatedAt:  string
  //   visible:    true
  //   content:    string
  //   shareId:    null
  //   commentId:  null
  //   authorId:   string
  //   images:     Image[]
  //   _count: {
  //     likes:          number
  //     shares:         number
  //     post_comments:  number
  //   }
  // }[]
  books:        Book & {
    authors: User[]
    chapters: {
      id:     string
      title:  string
      order:  number
      active: boolean
      words:  number
    }
  }[]
  _count: {
    posts:      number
    follower:   number
    following:  number
  }
  follower:    {
    isFan: boolean,
    following: UserStub[]
  }
  // following:    {
  //   isFan: boolean,
  //   follower: {
  //     id: string
  //     name: string
  //     image: string
  //   }
  // }[]
}

export const CyfrUserInclude = {
  _count: {
    select: {
      posts: true,
      follower: true,
      following: true
    }
  },
  // posts: {
  //   where: {
  //     visible: true,
  //     shareId: null,
  //     commentId: null
  //   },
  //   orderBy: {
  //     updatedAt: 'desc',
  //   },
  //   include: {
  //     images: true,
  //     _count: {
  //       select: {
  //         likes: true,
  //         shares: true,
  //         post_comments: true
  //       }
  //     }
  //   },
  //   take: 20
  // },
  books: {
    include: {
      cover: true,
      authors: true,
      chapters: {
        select: {
          id: true,
          title: true,
          order: true,
          active: true,
          words: true
        }
      }
    }
  },
  membership: true,
//   // user is a follower of, note includes books and stuff too
  follower: {
    where: {
      followingId: {
        not: null
      }
    },
    // orderBy: {
    //   following: {
    //     name: 'asc'
    //   }
    // },
    take: 20,
    select: {
      isFan: true,
      following: {
        select: {
          id: true,
          name: true,
          image: true,
          slug: true
        }
      }
    }
  },
//   // following this user
//   following: {
//     orderBy: {
//       follower: {
//         name: 'asc'
//       }
//     },
//     take: 20,
//     select: {
//       isFan: true,
//       follower: {
//         select: {
//           id: true,
//           name: true,
//           image: true
//         }
//       }
//     }
//   }
}


export type UserStub = {
  id:     string
  name:   string
  image:  string
  slug?:  string
}

/**
 * NOTE! Use a `select` instead of `include`
 * @returns {
 *  id: String
 *  name: String
 *  email: String
 *  image: String (url)
 *  slug: String
 * }
 */
export const UserStubSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  slug: true
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