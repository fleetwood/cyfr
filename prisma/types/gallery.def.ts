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
  creatorId: string
  title?: string|null
  description?: string|null
  images?: ImageFeed[]|Image[]|null
  files?: ImageUpsertProps[]|null
}

export type GalleryCreateProps = {
  galleryId?: string|null
  creatorId: string
  title?: string|null
  description?: string|null
  images?: ImageUpsertProps[]|Image[]|null
}

export type GalleryEngageProps = {
  creatorId: string
  galleryId: string
}

export type GalleryStub = Gallery & {
  creator: UserStub
  images: ImageStub[]
  likes:  UserStub[]
}

export const GalleryStubInclude = {
  images: {
    include: {
      _count: {
        select: {
        likes: true,
      }}
    }
  },
  likes: true,
}

export type GalleryDetail = Gallery & {
  creator: User
  likes:  EngageList[]
  images: any[]
}

export const GalleryDetailInclude = {
  creator: true,
  likes: EngageInclude,
  images: {
    include: ImageFeedInclude,
  },
}
