import { Image, User, Like, Share, Gallery, Post, UserStub, UserStubSelect, MainFeed, GalleryStub, PostStub } from "../prismaContext"

export type ImageUpsertProps = {
  id?:              string
  authorId:         string
  url:              string
  visible:          boolean
  height:           number
  width:            number
  title?:           string | null
  galleryId?:       string | null
  shareId:          string | null
  postId:           string | null
  commentThreadId:  string | null
}

export type ImageDeleteProps = {
  imageId: string
  authorId: string
}

export type ImageEngageProps = {
  imageId: string
  authorId: string
}

export type ImageStubViewProps = {
  image?:     ImageStub
  onClick?:   (image: ImageStub) => any
  className?: string
}

export type ImageFeed = Image & {
  author: UserStub
  likes: UserStub[]
  shares: UserStub[]
  galleryId?: string
  postId?: string
}

export const ImageFeedInclude = {
  author: {
    select: UserStubSelect
  },
  likes: true,
  shares: true,
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
  shares: UserStub[]
  author: UserStub[]
}

export type ImageDetail = ImageStub & {
  gallery?: GalleryStub
  post?: PostStub
}

export const ImageDetailInclude = {
  author: true,
  likes: {
    include: {
      author: true,
    },
  },
  shares: {
    include: {
      author: true,
    },
  },
  post: true,
  gallery: {
    include: {
      author: true,
      likes: {
        include: {
          author: true,
        },
      },
      shares: {
        include: {
          author: true,
        },
      },
    },
  },
}
