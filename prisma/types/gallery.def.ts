import { ImageFeed, ImageFeedInclude, ImageUpsertProps } from './image.def';
import {
  Follow,
  Gallery,
  Image,
  Like,
  Share,
  User,
  UserStub,
} from "../prismaContext"

export type GalleryUpsertProps = {
  galleryId?: string|null
  authorId: string
  title?: string|null
  description?: string|null
  images?: ImageFeed[]|Image[]|null
  files?: ImageUpsertProps[]|null
}

export type GalleryCreateProps = {
  galleryId?: string|null
  authorId: string
  title?: string|null
  description?: string|null
  images?: ImageUpsertProps[]|Image[]|null
}

export type GalleryEngageProps = {
  authorId: string
  galleryId: string
}

export type GalleryStub = Gallery & {
  images: Image[] // todo: include likes and shares
  likes: Like[]
  shares: Share[]
}

export const GalleryStubInclude = {
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
  shares: UserStub[]
  likes: UserStub[]
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
