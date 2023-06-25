import { UseQueryResult } from "react-query"
import { Book, BookCategory, BookStatus, ChapterStub, CharacterStub, Cover, CoverStub, CyfrUser, GalleryStub, Genre, Image, User, UserFollow, UserStub } from "../prismaContext"

export type BookRelations = {
  genre:        Genre
  authors:      UserStub[]
  gallery?:     GalleryStub
  cover?:       CoverStub
  follows?:     UserFollow[]
  likes?:       UserStub[]
  shares?:      UserStub[]
  chapters?:    ChapterStub[]
  characters?:  CharacterStub[]
  categories?:  BookCategory[]
}

export type BookStub = Book & {
  genre:        Genre
  authors:      UserStub[]
  gallery?:     GalleryStub
  cover?:       CoverStub
  _count: {
    follows?:     Number
    likes?:       Number
    shares?:      Number
    chapters?:    Number
    characters?:  Number
  }
}

export type BookDetail = Book & BookRelations

export type BookUpsertProps = {
  id?:          string|null
  title:        string,
  slug?:        string,
  completeAt?:  Date|null,
  active:       boolean,
  fiction:      boolean,
  prospect:     boolean,
  genreId:      string,
  status?:      BookStatus|null,
  back?:        string,
  hook?:        string,
  synopsis?:    string
  words?:       number
  categories?:  BookCategory[] | null,
  authors?:      User[]|CyfrUser[],
}

export type BookCreateProps = {

}

export type BookEngageProps = {
  bookId: string,
  authorId: string
}

export type ChangeCoverProps = {
  book:   Book
  cover?: Cover
  image?: Image
}

export type ChangeGenreProps = {
  bookId: string
  genreId: string
}

// TODO This does not account for startedAt and completeAt bc @#$@#$ Date -> String
export type BookApiUpdate = {
  props: {
    title?:       string | null
    active?:      boolean
    prospect?:    boolean
    fiction?:     boolean
    status?:      BookStatus
    back?:        string | null
    synopsis?:    string | null
    hook?:        string | null
    genreId?:     string | null
  }
  autoSave?:      boolean
}

export type BookDetailHook = BookDetail & {
  bookDetail:   BookDetail | null
  query:        UseQueryResult<any, any> & {
    invalidate: () => void
  }
  api:          any
}

export const BookStubInclude = {
  authors:  true,
  cover:    {
    include: {
      image: true
    }
  },
  genre:        true,
  gallery:      true,
  _count: { select: {
    likes:      true,
    shares:     true,
    follows:    true,
    chapters:   true,
    characters: true
  }}
}

export const BookDetailInclude = {
  genre:      true,
  authors:    true,
  cover:    {
    include: {
      image: true
    }
  },
  chapters:   true,
  characters: true,
  gallery:    true,
  likes:      true,
  follows:    true,
  shares:     true
}