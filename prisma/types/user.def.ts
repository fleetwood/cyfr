import { Agent, AgentStub, AgentStubInclude, Artist, ArtistStub, ArtistStubInclude, Author, AuthorStub, AuthorStubInclude, BookStub, Editor, EditorStub, EditorStubInclude, Follow, FollowStub, GalleriesStubInclude, GalleryStub, Membership, MembershipStub, MembershipStubSelect, MembershipType, Post, PostStub, PostStubInclude, Reader, ReaderStub, ReaderStubInclude, User } from "prisma/prismaContext"

export type FollowerTypes = 'Friends'|'Fans'|'Followers'|'Following'|'Stans'
export type UserTypes = 'Author' | 'Artist' | 'Editor' | 'Agent' | 'Reader' | 'Public'

export type UserSearchProps = {
  id:             string
  search?:        string
  followerTypes?: FollowerTypes[]
  userTypes?:     UserTypes[]
  agg?:           boolean
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
export type UserStub = {
  id:     string
  name:   string
  image:  string
  slug?:  string
  membership: MembershipStub
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
  membership: MembershipStubSelect
}}

export type UserDetail = User & {
  membership?:  MembershipStub
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
  membership: MembershipStubSelect,
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

export type CreatorStub = UserStub

export const CreatorStubSelect = { select: {
  id: true,
  name: true,
  image: true,
  slug: true,
  membership: { select: {
      id: true,
      expiresAt: true,
      type: {select: {
          id: true,
          name: true,
          level: true,
      }},
  }},
}}


export type UserSearchStub = UserStub & {
  author?:    AuthorStub
  artist?:    ArtistStub
  editor?:    EditorStub
  agent?:     AgentStub
  reader?:    ReaderStub
  
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

export const UserSearchStubSelect = (id:string) => {
  return {
    ...UserStubSelect.select,

    author: { include: {
      user: UserStubSelect,
      books: { where: {
        visible: true
      }},
      _count: { select: {
        shares: true,
        reviews: true
      }}
    }},
    artist: true,
    editor: true,
    agent: true,
    reader: true,

    follower: {
      where: {
        followingId: id
      },
      select: {
        isFan: true,
        followingId: true,
        follower: UserStubSelect,
      },
    },
    following: {
      where: {
        followerId: id
      },
      select: {
        isFan: true,
        followerId: true,
        following: UserStubSelect,
      },
    },
}}

export const membershipToType = (membership:MembershipStub):UserTypes=> {
  try {
    return membership.type.name as UserTypes
  }
  catch (e) {
    return 'Reader'
  }
}
export type AudienceLevels = 'PUBLIC' | 'USER' | 'READER' | 'MEMBER' | 'MEMBER_EXP' | 'AGENT' | 'AGENT_EXP' | 'ADMIN' | 'OWNER'
export const audienceToLevel = (level:string) => ['PUBLIC' , 'USER' , 'READER' , 'MEMBER' , 'MEMBER_EXP' , 'AGENT' , 'AGENT_EXP' , 'ADMIN' , 'OWNER'].indexOf(level)