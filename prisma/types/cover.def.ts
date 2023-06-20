import { Book, Cover, Genre, Image, UserStub, UserStubSelect } from "prisma/prismaContext"

export type CoverUpsertProps = {
  id?:        string
  authorId:   string
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
  authorId: string
}

export type CoverEngageProps = {
  coverId: string
  authorId: string
}

export type CoverStubViewProps = {
  cover?:     CoverStub
  onClick?:   (cover: CoverStub) => any
  className?: string
}

export type CoverStub = Cover & {
  image:  Image
  author: UserStub
  book?:  Book
  genre?: Genre
}

export type CoverDetail = CoverStub & {
}

export const CoverStubInclude = {
  image: true,
  author: true,
  book: true,
  genre: true
}

export const CoverDetailInclude = {
  image: true,
  author: true,
  book: true,
  genre: true
}
