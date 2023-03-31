import { Book, BookCategory, Chapter, Character, Covers, Follow, Gallery, Genre, Like, User, UserFeed } from "../prismaContext"

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

export type GenreListItem = Genre & {
    covers: Covers[]
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
              likes: true
            }
          }
        }
      }
}