import { CreatorStub, CreatorStubSelect, Like, Share, ShareStub, ShareStubInclude, UserStub, UserStubSelect } from "prisma/prismaContext"

export type LikeProps = {
  creatorId:    string
  postId?:      string
  galleryId?:   string
  imageId?:     string
  commentId?:   string
  characterId?: string
  bookId?:      string
}

export type LikeStub = Like & CreatorStub

export const LikeStubInclude = {
  likes: {
    include: {
      creator: CreatorStubSelect
    }
    , take: 10
  }
}
