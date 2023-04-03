import { ImageCreateProps, ImageFeed, ImageFeedInclude } from './image.def';
import {
  Follow,
  Gallery,
  Image,
  Like,
  Share,
  User,
  UserSimple,
} from "../prismaContext"

export type GalleryCreateProps = {
  authorId: string
  title?: string|null
  description?: string|null
  images?: ImageCreateProps[]|null
}

export type GalleryEngageProps = {
  authorId: string
  galleryId: string
}

export type GalleryFeed = Gallery & {
  images: (Image & {
    _count: {
      likes: number,
      shares: number
    }
  })[]
  likes: Like[]
  shares: Share[]
}

export const GalleryFeedInclude = {
  images: {
    include: {
      _count: {
        select: {
        likes: true,
        shares: true
      }}
    }
  },
  likes: true,
  shares: true,
}

export type GalleryDetail = Gallery & {
  // todo: add shares and likes back in to the gallery
  author: User
  shares: UserSimple[]
  likes: UserSimple[]
  images: any[]
}

export const GalleryDetailInclude = {
  author: {
    include: {
      galleries: true,
      follower: true,
      _count: {
        select: {
          posts: true,
          images: true,
          galleries: true,
        },
      },
    },
  },
  shares: { include: { author: true } },
  likes: { include: { author: true } },
  images: {
    include: ImageFeedInclude,
  },
}
