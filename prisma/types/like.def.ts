import { Like, UserStub } from "./../prismaContext"

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
