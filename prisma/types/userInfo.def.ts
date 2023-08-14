import useDebug from "hooks/useDebug"
import {AgentStub, AuthorStub, BookStub, GalleryStub, Membership, MembershipType, Publisher, UserStub, UserStubSelect, UserTypes} from "prisma/prismaContext"
import {KeyVal} from "types/props"
import {capFirstLetter} from "utils/helpers"

const {debug} = useDebug('userInfo.def')
export type UserInfoType = AgentInfo|ArtistInfo|AuthorInfo|EditorInfo|ReaderInfo|UserInfo

export type UserInfo = UserStub & {
  followers:  number
  fans:       number
  following:  number
  stans:      number
  likes:      number
}

export const UserInfoSelect = { select: {
  id: true,
  name: true,
  image: true,
  slug: true,
  membership: { include: {
    type: true
  }},
  following: {
    select: {
      isFan: true,
    },
  },
  follower: {
    select: {
      isFan: true,
    },
  },
  _count: { select: {
    likes:      true,
  }}
}}

export type AgentInfo = UserInfo & {
  books:      number
  // publisher:  number
  // authors:    number
}

export const AgentInfoSelect = { select: {
  ...UserInfoSelect.select,
  _count: { select: {
    likes:      true,
    books:      true,
    // publisher:  true,
    // authors:    true,
  }}
}}

export type ArtistInfo = UserInfo & {
  covers:     number
  galleries:  number
  books:      number
}

export const ArtistInfoSelect =  { select: {
  ...UserInfoSelect.select,
  _count: {
    select: {
      likes:      true,
      covers:     true,
      galleries:  true,
      books:      true,
    },
  },
}}

export type AuthorInfo = UserInfo & {
  reviews:    number
  books:      number
  agents:     number
}

export const AuthorInfoSelect =  { select: {
  ...UserInfoSelect.select,
  _count: {
    select: {
      likes:    true,
      reviews:  true,
      books:    true,
      agents:   true,
    },
  },
}}

export type EditorInfo = UserInfo & {
  reviews:    number
  books:      number
}

export const EditorInfoSelect =  { select: {
  ...UserInfoSelect.select,
  _count: {
    select: {
      likes: true,
      reviews: true,
      books: true,
    },
  },
}}

export type ReaderInfo = UserInfo & {
  reviews:    number
  // reads:      number
}

export const ReaderInfoSelect =  { select: {
  ...UserInfoSelect.select,
  ...{_count: {
    select: {
      likes:    true,
      reviews:  true,
      // reads:    true,
    },
  }},
}}

export const GetInfoSelector = (userType?:UserTypes)=> {
    switch (userType) {
      case 'Agent':
        return AgentInfoSelect
        
      case 'Artist':
        return ArtistInfoSelect
        
      case 'Author':
        return AuthorInfoSelect
        
      case 'Editor':
        return EditorInfoSelect
        
      case 'Reader':
        return ReaderInfoSelect   
    }
    
    return UserInfoSelect
}

export const MapInfo = <T = UserInfoType>(result:any, userType?: UserTypes):T => {
  debug(`MapInfo<${userType??'T'}>`)
  const {
    id,
    name,
    image,
    slug,
    membership,
    _count: { 
      likes: likes
    },
  } = result

  let userInfo:UserInfoType = {
    id,
    name,
    image,
    slug,
    membership,
    likes,
    following: (result.follower ?? []).filter(
      (f: { isFan: boolean }) => f.isFan === false
    ).length,
    stans: (result.follower ?? []).filter(
      (f: { isFan: boolean }) => f.isFan === true
    ).length,
    followers: (result.following ?? []).filter(
      (f: { isFan: boolean }) => f.isFan === false
    ).length,
    fans: (result.following ?? []).filter(
      (f: { isFan: boolean }) => f.isFan === true
    ).length,
  }

  switch (userType) {
    case 'Agent':
      debug('Mapping userInfo as Agent')
      userInfo = {
        ...userInfo,
        books: result._count.books ?? 0,
        publisher: result._count.publisher ?? 0,
        authors: result._count.publisher ?? 0,
      } as AgentInfo
      break

    case 'Artist':
      debug('Mapping userInfo as Artist')
      userInfo = {
        ...userInfo,
        covers: result._count.covers ?? 0,
        galleries: result._count.galleries ?? 0,
        books: result._count.books ?? 0,
      } as ArtistInfo
      break

    case 'Author':
      debug('Mapping userInfo as Author')
      userInfo = {
        ...userInfo,
        reviews: result._count.reviews ?? 0,
        agents: result._count.agents ?? 0,
        books: result._count.books ?? 0,
      } as AuthorInfo
      break

    case 'Editor':
      debug('Mapping userInfo as Editor')
      userInfo = {
        ...userInfo,
        reviews: result._count.reviews ?? 0,
        books: result._count.books ?? 0,
      } as EditorInfo
      break

    case 'Reader':
      debug('Mapping userInfo as Reader')
      userInfo = {
        ...userInfo,
        reviews: result._count.reviews ?? 0,
        reads: result._count.books ?? 0,
      } as ReaderInfo
      break

    default:
      debug('Did not map userInfo', userType)
      break
  }

  return userInfo as T

}
