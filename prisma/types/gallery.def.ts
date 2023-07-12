import {
  Commune,
  Gallery,
  Image,
  Like,
  LikesCountInclude,
  LikesInclude,
  UserStub
} from "prisma/prismaContext";
import { ImageStub, ImageUpsertProps } from './image.def';

export type GalleryUpsertProps = {
  galleryId?: string|null
  creatorId: string
  title?: string|null
  description?: string|null
  images?: ImageStub[]|Image[]|null
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
  commune?: Commune
  creator:  UserStub
  likes:    (Like & {
    creator: UserStub
  })[]
  images: (Image & {
    likes:  (Like & {
      creator: UserStub
    })[]
    _count: {
      shares: number
      likes:  number
    }
  })[]
  _count: {
    shares: number
    likes:  number
  }
}

export const GalleryDetailInclude = {include: {
  commune: true,
  creator: {
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      membership: true
    }
  },
  likes: {
    include: {
      creator: true
    },
    take: 10,
    // orderBy: {
    //   createdAt: 'desc'
    // }
  },
  images: {
    include: {
      likes: {
        include: {
          creator: true
        },
        take: 10,
      },
      _count: {
        select: {
          shares: true,
          likes: true
        }
      }
    }
  },
  _count: {
    select: {
      shares: true,
      likes: true
    }
  }
}}
