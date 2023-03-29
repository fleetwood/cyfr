import { Image, User, Like, Share, Gallery, Post, UserSimple } from "../prismaContext"

export type ImageCreateProps = {
  authorId: string
  url: string
  height: number
  width: number
  title?: string
  galleryId?: string
}

export type ImageDeleteProps = {
  imageId: string
  authorId: string
}

export type ImageEngageProps = {
  imageId: string
  authorId: string
}

export type ImageViewProps = {
  image?: ImageFeed | null
  onClick?: Function
  className?: string
}

export type ImageFeed = Image & {
  author: UserSimple
  likes: UserSimple[]
  shares: UserSimple[]
  galleryId?: string
  postId?: string
}

export const ImageFeedInclude = {
  author: true,
  likes: true,
  shares: true,
  gallery: true,
  post: true
}

export type ImageDetail = Image & {
  author: User
  likes: (Like & { author: User })[]
  shares: (Share & { author: User })[]
  gallery?: (Gallery & {
    author: User
    likes: (Like & { author: User })[]
    shares: (Share & { author: User })[]
  })|null
  post?: Post|null
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
