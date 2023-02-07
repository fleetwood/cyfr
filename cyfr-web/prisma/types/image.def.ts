import { Image, User, Like, Share, Gallery, Post } from "../prismaContext"
import { UserFeed } from "./user.def"

export type ImageCreateProps = {
  authorId: string
  url: string
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
  author: User
  likes: Like[]
  shares: Share[]
  gallery?: Gallery|null
  post?: Post|null
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
