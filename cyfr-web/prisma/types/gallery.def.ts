import {
  Fan,
  Follow,
  Gallery,
  Image,
  Like,
  Share,
  User,
} from "../prismaContext"

export type GalleryItem = Gallery & {
  images: Image[]
  _count: {
    likes: number
    shares: number
  }
}

export type GalleryDetail = Gallery & {
  author: User & {
    galleries: Gallery[]
    follower: Follow[]
    following: Follow[]
    fans: Fan[]
    fanOf: Fan[]
    _count: {
      select: {
        posts: number
        images: number
        galleries: number
      }
    }
  }
  shares: (Share & {
    author: User
  })[]
  likes: (Like & {
    author: User
  })[]
  images: (Image & {
    shares: Share & {
      author: User
    }
    likes: Like & {
      author: User
    }
  })[]
}

export const GalleryDetailInclude = {
  author: {
    include: {
      galleries: true,
      follower: true,
      following: true,
      fans: true,
      fanOf: true,
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
    include: {
      shares: { include: { author: true } },
      likes: { include: { author: true } },
    },
  },
}
