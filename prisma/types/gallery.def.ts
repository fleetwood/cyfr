import {
  EngageInclude,
  EngageList,
  Gallery,
  Image,
  LikesCountInclude,
  LikesInclude,
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

export const GalleryFeedInclude = { include: {
  images: {
    include: {
      creator: {
        select: {
          name: true,
          email: true,
          slug: true,
          image: true
        }
      },
      gallery: true
    }
  },
  ...LikesCountInclude,
  ...LikesInclude
}}

export type GalleryStub = Gallery & {
  creator: UserStub
  images: ImageStub[]
  _count: {
    likes:  number,
    shares: number
  }
}

export const GalleryStubInclude = {include: {
  galleries: {
    where: {
      visible: true
    },
    include: {
      creator: true,
      images: {
        include: {
        _count: {
          select: {
            likes: true,
            shares: true
          }
        }}
      },
      _count: {
        select: {
          likes: true,
          shares: true
        }
      }
    }
  }
}}

export type GalleryDetail = Gallery & {
  creator: User
  // likes:  EngageList[]
  // images: any[]
}

export const GalleryDetailInclude = {
  creator: true,
  // likes: EngageInclude,
  // images: {
  //   include: ImageFeedInclude,
  // },
}
