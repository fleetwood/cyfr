import { Book, BookStub, Follow, GalleryStub, LikesAndCount, LikesAndCountsInclude, Membership, MembershipType, Post, PostStub, User } from "./../prismaContext"

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
  membership?:  Membership & {
    type:   MembershipType
  }
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

export type CreatorStub = {
  creator: {
    id: string
    name: string
    image: string
    slug: string
    membership?: Membership
  }
}

export const CreatorStubInclude = {
  creator: {
    select: {
      id: true,
      name: true,
      image: true,
      slug: true,
      membership: true
    }
  }
}

export type AudienceLevels = 'PUBLIC' | 'USER' | 'READER' | 'MEMBER' | 'MEMBER_EXP' | 'AGENT' | 'AGENT_EXP' | 'ADMIN' | 'OWNER'
export const audienceToLevel = (level:string) => ['PUBLIC' , 'USER' , 'READER' , 'MEMBER' , 'MEMBER_EXP' , 'AGENT' , 'AGENT_EXP' , 'ADMIN' , 'OWNER'].indexOf(level)