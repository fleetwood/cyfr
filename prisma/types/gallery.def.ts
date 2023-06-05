import {
  EngageInclude,
  EngageList,
  Gallery,
  Image,
  User,
  UserStub
} from "../prismaContext";
import { ImageFeed, ImageFeedInclude, ImageStub, ImageUpsertProps } from './image.def';

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
  author: UserStub
  images: ImageStub[]
  likes:  UserStub[]
  shares: UserStub[]
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
  author: User
  shares: EngageList[]
  likes:  EngageList[]
  images: any[]
}

export const GalleryDetailInclude = {
  author: true,
  shares: EngageInclude,
  likes: EngageInclude,
  images: {
    include: ImageFeedInclude,
  },
}
