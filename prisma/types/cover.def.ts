import { Artist, ArtistStub, Book, Cover, CreatorStub, CreatorStubInclude, Genre, Image, User, UserStub, UserStubSelect } from "prisma/prismaContext"

export type CoverUpsertProps = {
  id?:        string
  creatorId:   string
  imageId:    string
  bookId?:    string
  genreId?:   string
  height?:    number
  width?:     number
  title?:     string
  active?:    boolean
}

export type CoverDeleteProps = {
  coverId: string
  creatorId: string
}

export type CoverEngageProps = {
  coverId: string
  creatorId: string
}

export type CoverStubViewProps = {
  cover?:     CoverStub
  onClick?:   (cover: CoverStub) => any
  className?: string
}

export type CoverStub = Cover & {
  image:    Image
  creator:  CreatorStub
  artists:  ArtistStub[]
  genre?:   Genre
  _count: {
    likes:  number
    shares: number
  }
}

export const CoverStubInclude = { include: {
  image: true,
  creator: {
    select: {
      id: true,
      name: true,
      image: true,
      slug: true,
      membership: true
    }
  },
  artists: {
    include: {
      user: {
        select: {
          name: true,
          id: true,
          slug: true,
          image: true,
        },
      },
    },
  },
  genre: true,
  _count: {
    select: {
      likes: true,
      shares: true
    }
  }
}}

export type CoverDetail = CoverStub & {
}

export const CoverDetailInclude = CoverStubInclude
