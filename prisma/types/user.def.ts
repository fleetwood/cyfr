import { Agent, Artist, Author, BookStub, Editor, Follow, FollowStub, GalleriesStubInclude, GalleryStub, Membership, MembershipType, Post, PostStub, PostStubInclude, Reader, User } from "prisma/prismaContext"

export type FollowerTypes = 'Friends'|'Fans'|'Followers'|'Following'|'Stans'
export type UserTypes = 'Author' | 'Artist' | 'Editor' | 'Agent' | 'Reader' | 'Public'

export type UserSearchProps = {
  id:             string
  search?:        string
  followerTypes?: FollowerTypes[]
  userTypes?:     UserTypes[]
  agg?:           boolean
}

export type UserSearchStub = UserStub & {
  author?:    Author
  artist?:    Artist
  editor?:    Editor
  agent?:     Agent
  reader?:    Reader
  
  follower:  ({
    isFan: boolean,
    followingId: string,
    follower: UserStub
  })[]

  following:  ({
    isFan: boolean,
    followerId: string,
    following: UserStub
  })[]

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

export type CyfrUser = User & {
  membership?:  Membership & {
    type:   MembershipType
  }
  agent?:  Agent  // user is an agent
  artist?: Artist // user is an artist
  author?: Author 
  editor?: Editor // user is an editor
  reader?: Reader // user is a reader
  books:       BookStub[]
  galleries:   GalleryStub[]
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
  agent: true,
  artist: true,
  author: true,
  editor: true,
  reader: true,
  galleries: { include: {
    creator: { select: { 
      id: true,
      name: true,
      image: true,
      membership: true
    }},
    images: { include: {
      _count: { select: {
        likes: true,
        shares: true
      }}
    }},
    commentThread: { include: {
      comments: { include: {
          creator: true
        },
        take: 10
      },
      _count: { select: {
          comments: true
      }}
    }},
    permission: true,
      _count: { select: {
        likes: true,
        shares: true
    }},
  }},
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
  membership: { include: {
    type: true
  }}
}

export type UserStub = {
  id:     string
  name:   string
  image:  string
  slug?:  string
  membership: Membership & {
    type: MembershipType
  }
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
export const UserStubSelect = { select: {
  id: true,
  name: true,
  image: true,
  slug: true,
  membership: { include: {
    type: true
  }}
}}

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
      following: UserStubSelect,
    },
    orderBy: {createdAt: 'desc'},
    take: 10
  },
  following: {
    include: {
      follower: UserStubSelect,
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
  membership?: Membership & {
    type: MembershipType
  }
}

export const CreatorStubSelect = {
  select: {
    id: true,
    name: true,
    image: true,
    slug: true,
    membership: { include: {
      type: true
    }}
  }
}

export type UserInfo = {
  id:         string
  name:       string
  image?:     string
  slug?:      string
  followers:  number
  fans:       number
  following:  number
  stans:      number
  likes:      number
  books:      number
  posts:      number
  galleries:  number
  membership: Membership & {
    type: MembershipType
  }
}

export const UserInfoSelect = { select: {
  id: true,
  name: true,
  image: true,
  slug: true,
  membership: { include: {
    type: true
  }},
  following: { select: {
    isFan: true
  }},
  follower: { select: {
      isFan: true
  }},
  _count: { select: {
    likes:      true,
    books:      true,
    posts:      true,
    galleries:  true,
  }}
}}

export type AudienceLevels = 'PUBLIC' | 'USER' | 'READER' | 'MEMBER' | 'MEMBER_EXP' | 'AGENT' | 'AGENT_EXP' | 'ADMIN' | 'OWNER'
export const audienceToLevel = (level:string) => ['PUBLIC' , 'USER' , 'READER' , 'MEMBER' , 'MEMBER_EXP' , 'AGENT' , 'AGENT_EXP' , 'ADMIN' , 'OWNER'].indexOf(level)