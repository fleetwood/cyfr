import { CreatorStub, CreatorStubSelect, Like, ShareStub, ShareStubInclude, UserStub, UserStubSelect } from "prisma/prismaContext"

export type LikeProps = {
  creatorId:     String
  postId?:      String
  galleryId?:   String
  imageId?:     String
  commentId?:   String
  characterId?: String
  bookId?:      String
}

export type LikeStub = Like & CreatorStub

export type LikesAndCount = {
  likes: (LikeStub)[]
  _count: {
    likes: number
  }
}

export const LikesCountInclude = {
  _count: {
    select: {
      likes: true
    } 
  }
}

export const LikesInclude = {
  likes: {
    ...CreatorStubSelect,
    take: 10
  },
  ...LikesCountInclude
}

export const LikesAndCountsInclude = {...LikesInclude, ...LikesCountInclude}

export type LikesAndShares = {
  _count: {
    likes: number
    shares: number
  }
  likes: LikeStub[]
  shares: ShareStub[]
}

export const LikesAndSharesInclude = { include: {
  _count: {
    select: {
      shares: true
    }},
    shares: {
      ...ShareStubInclude,
      take: 10
    }
  },
  ...LikesInclude,
}