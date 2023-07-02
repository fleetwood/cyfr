import {
  Book,
  BookCategory,
  BookStub,
  CoverStub,
  Gallery,
  Genre,
  Image,
  User
} from '../prismaContext'

export type GenreStub = Genre & {
  covers:   CoverStub[]
  _count:   {
    books: number
  }
}

export type GenreDetail = Genre & {
  covers:   CoverStub[]
  books: BookStub[]
}

export type GenreDeleteProps = {
  id?: string
  title?: string
}

export type GenreUpsertProps = {
  title: string
  description: string
  fiction: boolean
}

export type GenreAddBookProps = {
  title: string
  book: Book
}

export type GenreAddCoverProps = {
  id:       string
  image:    Image
}

export type GenreFeed = Genre & {
  books: (Book & {
    authors: User[]
    categories: BookCategory[]
    gallery: Gallery
    _count: {
      chapters: Number
      characters: Number
      fans: Number
      likes: Number
    }
  })[]
}

export const GenreFeedInclude = {
  books: {
    include: {
      authors: true,
      categories: true,
      gallery: true,
      _count: {
        select: {
          chapters: true,
          characters: true,
          fans: true,
          likes: true,
        },
      },
    },
  },
}

export const GenreStubInclude = {
  covers: {
    include: {
      image: true,
      creator: true
    },
  },
  _count: {
    select: {
      books: true,
    },
  },
}