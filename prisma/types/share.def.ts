import { PostStub, Share, User } from "./../prismaContext"

export type ShareDeleteProps = {
  id:         String
  authorId:   String
}

export type ShareProps = {
  id?:            String
  authorId:       String
  visible?:       boolean
  postId?:        String
  galleryId?:     String
  imageId?:       String
  characterId?:   String
  bookId?:        String
}

export type ShareFeed = Share & {
  createdat?: String
  updatedat?: String
  author:     User
  post?:      PostStub | null
}
