import { Book, BookCategory, BookStatus, Chapter, Character, CyfrUser, Follow, Gallery, Genre, Image, Like, Share, User, UserStub } from "../prismaContext"

export type BookStub = Book & {
  authors: {
    id: string
    name: string
    email: string
    image: string
    follows: UserStub[],
    followers: UserStub[],
    postCount: number
  }[],
  cover?: Image
  genre: Genre
  categories: BookCategory[]
  likes: Number
  follows: Number
  chapters: Number
}

export const BookListInclude = {
}

export type BookFeed = Book & {
  authors: User[],
  categories: BookCategory[],
  chapters: Chapter[],
  fans: Follow[],
  gallery: Gallery,
  genre: Genre,
  likes: Like[]
}

export const BookFeedInclude = {
  authors: true,
  categories: true,
  chapters: true,
  characters: true,
  fans: true,
  gallery: true,
  genre: true,
  likes: true
 }

export type BookDetail = {
  authors: UserStub[]
  id: string
  createdAt: string
  updatedAt: string
  startedAt: string | null
  completeAt: string | null
  active: boolean
  status: BookStatus | null
  prospect: boolean
  fiction: boolean
  title: string
  slug: string
  coverId: string | null
  hook: string | null
  synopsis: string | null
  back: string | null
  words: number
  galleryId: string | null
  categories: BookCategory[],
  characters: Character[],
  gallery: Gallery,
  genreId: string
  genre: Genre
  likes: Like[]
  follows: Follow[]
  shares: Share[]
  cover: Image
  chapters: Chapter[]
}

export const BookDetailInclude = {
  authors: true,
  categories: true,
  chapters: true,
  characters: true,
  follows: true,
  gallery: true,
  genre: true,
  likes: true,
  cover: true
}

export type BookUpsertProps = {
  id?:          string|null
  cover?:       string
  title:        string,
  slug?:        string,
  active:       boolean,
  prospect:     boolean,
  authors:      User[]|CyfrUser[],
  genreId:      string,
  status?:      BookStatus|null,
  categories?:  BookCategory[] | null,
  back?:        string,
  hook?:        string,
  synopsis?:    string
  words?:       number
}

export type BookDeleteProps = {
  bookId: string,
  authorId: string
}
