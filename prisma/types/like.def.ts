import { Like, UserStub, UserStubSelect } from "prisma/prismaContext"

export type LikeProps = {
  creatorId:     String
  postId?:      String
  galleryId?:   String
  imageId?:     String
  commentId?:   String
  characterId?: String
  bookId?:      String
}

export type LikeStub = Like & {
  creator: UserStub
}

export type LikesCount = {
  likes:  LikeStub[]
  _count: {
    likes:  Number
  }
}

export const LikesInclude = { include: {
  likes: {
    include: {
      creator: UserStubSelect
    },
    take: 10
  }
}}

export const LikesCount = {
  _count: {
    select: {
      likes: true
    } 
  }
}