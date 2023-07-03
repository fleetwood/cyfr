import { CreatorStub, CreatorStubInclude, Like, UserStub, UserStubSelect } from "prisma/prismaContext"

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
    include: CreatorStubInclude,
    take: 10
  },
  ...LikesCountInclude
}

export const LikesAndCountsInclude = {...LikesInclude, ...LikesCountInclude}