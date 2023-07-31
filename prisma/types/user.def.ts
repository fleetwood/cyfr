import { Agent, Artist, Author, Book, BookStub, Editor, Follow, FollowStub, Gallery, GalleryStub, GalleriesStubInclude, LikesAndCount, LikesAndCountsInclude, LikesCountInclude, LikesInclude, Membership, MembershipType, Post, PostStub, PostStubInclude, Reader, User } from "prisma/prismaContext"

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

export type CyfrUser = User & {
  membership?:  Membership & {
    type:   MembershipType
  }
  userAgent?:  Agent  // user is an agent
  userArtist?: Artist // user is an artist
  userAuthor?: Author 
  userEditor?: Editor // user is an editor
  userReader?: Reader // user is a reader
  books:        BookStub[]
  galleries: {
        id: string
        createdAt: string
        updatedAt: string
        visible: boolean
        title?: string
        description?: string
        creatorId: string,
        shareId?: string,
        _count: {
          images: number,
          likes:  number,
          shares: number
        }
  }[]
  _count: {
    posts:      number
    follower:   number
    following:  number
  }
}

export const CyfrUserInclude = {
  _count: {
    select: {
      posts: true,
      follower: true,
      following: true
    }
  },
  userAgent: true,
  userArtist: true,
  userAuthor: true,
  userEditor: true,
  userReader: true,
  galleries: {
    include: {
      _count: {
        select: {
          images: true,
          likes: true,
          shares: true
        }
      }
    }
  },
  books: {
    include: {
      cover: true,
      authors: true,
      _count: {
        select: {
          chapters: true,
          likes: true,
          shares: true
        }
      }
    }
  },
  membership: true
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
 *  image: String (url)
 *  slug: String
 * }
 */
export const UserStubSelect = {
  id: true,
  name: true,
  image: true,
  slug: true
}

export type UserDetail = User & {
  membership?:  Membership & {
    type:   MembershipType
  },
  posts:        PostStub[]
  books:        BookStub[]
  follower:     FollowStub[]
  following:    FollowStub[]
  galleries:    GalleryStub[]
  // books:        BookStub[]
  _count: {
    likes:        number,
    posts:        number,
    follower:     number,
    following:    number,
    books:        number,
    galleries:    number,
    submissions:  number
  }
}

export const UserDetailInclude = { include: {
  membership: {
    include: {
      type: true
    }
  },
  galleries: GalleriesStubInclude,
  posts: {...PostStubInclude, take: 10, orderBy: {updatedAt: 'desc'}},
  // books: {
  //   where: {
  //     visible: true
  //   },
  //   include: {
  //     cover: true,
  //     authors: true,
  //     _count: {
  //       select: {
  //         chapters: true,
  //         characters: true,
  //         likes: true,
  //         shares: true
  //       }
  //     }
  //   }
  // },
  follower: {
    include: {
      following: {
        select: UserStubSelect
      },
    },
    orderBy: {createdAt: 'desc'},
    take: 10
  },
  following: {
    include: {
      follower: {
        select: UserStubSelect
      },
    },
    orderBy: {createdAt: 'desc'},
    take: 10
  },
  _count: {
    select: {
      likes: true,
      posts: true,
      follower: true,
      following: true,
      books: true,
      galleries: true,
      submissions: true
    }
  }
}}

/**
 * NOTE! Use a `select` instead of `include`
 * @property id: String
 * @property name: String
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

export type CreatorStub = UserStub & {
  membership?: Membership
}

export const CreatorStubSelect = {
  select: {
    id: true,
    name: true,
    image: true,
    slug: true,
    membership: true
  }
}

export type CreatorAndLikesAndCount = LikesAndCount & {
  creator: CreatorStub
}

export const CreatorLikesCountInclude = {include: {...CreatorStubSelect,...LikesAndCountsInclude}}

export type UserInfo = User & {
  _count: {
    likes:      number
    following:  number
    follower:   number
    books:      number
    posts:      number
    galleries:  number
  },
  membership: Membership & {
    type: MembershipType
  }
}

export const UserInfoInclude = { include: {
  membership: {
    include: {
      type: true
    }
  },
  _count: {
    select: {
      likes:      true,
      following:  true,
      follower:   true,
      books:      true,
      posts:      true,
      galleries:  true,
  }}
}}

export type AudienceLevels = 'PUBLIC' | 'USER' | 'READER' | 'MEMBER' | 'MEMBER_EXP' | 'AGENT' | 'AGENT_EXP' | 'ADMIN' | 'OWNER'
export const audienceToLevel = (level:string) => ['PUBLIC' , 'USER' , 'READER' , 'MEMBER' , 'MEMBER_EXP' , 'AGENT' , 'AGENT_EXP' , 'ADMIN' , 'OWNER'].indexOf(level)