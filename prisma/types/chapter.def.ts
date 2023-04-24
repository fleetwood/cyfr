import { Book, BookCategory, BookDetail, BookStatus, BookStub, Chapter, Character, CyfrUser, Follow, Gallery, GalleryStub, Genre, Image, Like, Share, User, UserStub } from "../prismaContext"

/**
 * @property characters {@link Character} TODO: should be a CharacterStub
 */
export type ChapterStub = Chapter & {
  book: BookStub
  gallery: GalleryStub
  characters: Character[]
}

/** 
 * @property characters {@link Character} TODO: should be a CharacterStub
 */
export type ChapterDetail = Chapter & {
  book:         BookDetail
  gallery?:     Gallery
  characters?:  Character[]
}

export type ChapterUpsertProps = {
  id?:        string|null
  title:      string
  active:     boolean
  bookId:     string
  content?:   string
  words?:     number
  order:      number
  createdAt?: string
  updatedAt?: string
}

export type ChapterApiProps = {
  chapterDetail:  ChapterDetail,
  cyfrUser?:      CyfrUser
}

export type ChapterApiUpdate = {
  title?:    string
  active?:   boolean
  order?:    number
  words?:    number
  content?:  string
}