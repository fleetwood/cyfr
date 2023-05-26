import { Dispatch, SetStateAction } from "react"
import { Book, BookCategory, BookStatus, Chapter, ChapterStub, Character, CharacterStub, CyfrUser, Gallery, GalleryStub, Genre, GenreStub, Image, User, UserFollow, UserStub } from "../prismaContext"
import { RocketQuery } from "../../types/props"
import { UseQueryResult } from "react-query"

export type BookRelations = {
  genre:        Genre
  authors:      UserStub[]
  gallery?:     GalleryStub
  cover?:       Image
  follows?:     UserFollow[]
  likes?:       UserStub[]
  shares?:      UserStub[]
  chapters?:    ChapterStub[]
  characters?:  CharacterStub[]
  categories?:  BookCategory[]
}

export type BookStub = Book & BookRelations

export type BookDetail = Book & BookRelations

export type BookUpsertProps = {
  id?:          string|null
  cover?:       string
  title:        string,
  slug?:        string,
  completeAt?:  Date|null,
  active:       boolean,
  fiction:      boolean,
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

export type BookCreateProps = {

}

export type BookEngageProps = {
  bookId: string,
  authorId: string
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
