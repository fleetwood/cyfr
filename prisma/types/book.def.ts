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

export type BookDeleteProps = {
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

export type BookDetailState = {
  current:        BookDetail
  isAuthor:       boolean,
  id:             string
  createdAt:      string
  updatedAt:      string
  setUpdatedAt:   Dispatch<SetStateAction<string | null>>
  startedAt:      string
  setStartedAt:   Dispatch<SetStateAction<string | null>>
  completeAt:     string
  setCompleteAt:  Dispatch<SetStateAction<string | null>>
  active:         boolean
  setActive:      Dispatch<SetStateAction<boolean>>
  status:         BookStatus
  setStatus:      Dispatch<SetStateAction<BookStatus>>
  prospect:       boolean
  setProspect:    Dispatch<SetStateAction<boolean>>
  fiction:        boolean
  setFiction:     Dispatch<SetStateAction<boolean>>
  title:          string
  setTitle:       Dispatch<SetStateAction<string | null>>
  back:           string
  setBack:        Dispatch<SetStateAction<string | null>>
  hook:           string
  setHook:        Dispatch<SetStateAction<string | null>>
  synopsis:       string
  setSynopsis:    Dispatch<SetStateAction<string | null>>
  slug:           string
  setSlug:        Dispatch<SetStateAction<string | null>>
  // RELATIONS
  coverId:        string
  setCoverId:     Dispatch<SetStateAction<string | null>>
  genreId:        string
  setGenreId:     Dispatch<SetStateAction<string | null>>
  galleryId:      string
  setGalleryId:   Dispatch<SetStateAction<string | null>>
}


export type BookDetailHook = BookDetail & {
  bookDetail:     BookDetail | null
  query:          UseQueryResult<any, any> & {
    invalidate :  () => void
  }
  api:            BookDetailApi
  // state:          BookDetailState
  // relations:      BookRelations
}

export type BookDetailApi = {
  addChapter:     (bookId: string, title: string, order: number) => Promise<any>
  addGallery:     (bookId: string, galleryId?: string) => Promise<any>
  follow:         (bookId: string, followerId: string, isFan?: boolean) => Promise<boolean>
  like:           (bookId: string, userId: string) => Promise<boolean>
  share:          (bookId: string, userId: string) => Promise<boolean>
  save:           (detail?:BookDetail) => Promise<boolean>
  sortChapters:   (changedChapter: Chapter) => Promise<Boolean>
  updateChapter:  (chapter: Chapter) => Promise<boolean>
  updateGenre:    (genreId: string) => Promise<boolean>
  isAuthor:       (bookDetail: BookDetail, cyfrUser?: CyfrUser) => boolean
}