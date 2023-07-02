import { Image, User, Like, Gallery, Post, UserStub, UserStubSelect, MainFeed, GalleryStub, PostStub } from "../prismaContext"

export type ImageUpsertProps = {
  id?:              string
  creatorId:         string
  url:              string
  visible:          boolean
  height:           number
  width:            number
  title?:           string | null
  galleryId?:       string | null
  postId:           string | null
  commentThreadId:  string | null
}

export type ImageDeleteProps = {
  imageId: string
  creatorId: string
}

export type ImageEngageProps = {
  imageId: string
  creatorId: string
}

export type ImageStubViewProps = {
  image?:     ImageStub
  onClick?:   (image: ImageStub) => any
  className?: string
}

export type ImageFeed = Image & {
  creator: UserStub
  // likes: UserStub[]
  galleryId?: string
  postId?: string
}

export const ImageFeedInclude = {
  creator: {
    select: UserStubSelect
  },
  likes: true,
  gallery: true,
  post: true
}

export type ImageStub = {
  id: string
  visible: boolean
  title: string | null
  url: string
  height: number | null
  width: number | null
  likes: UserStub[]
  creator: UserStub[]
}

export type ImageDetail = ImageStub & {
  gallery?: GalleryStub
  post?: PostStub
}

export const ImageDetailInclude = {
  creator: true,
  likes: {
    include: {
      creator: true,
    },
  },
  post: true,
  gallery: {
    include: {
      creator: true,
      likes: {
        include: {
          creator: true,
        },
      }
    },
  },
}
