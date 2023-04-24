import { BookDetail, BookStub, Chapter, Character, CyfrUser, Gallery, GalleryStub } from "../prismaContext"

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

export type ChapterApi = {
  update:         (props: ChapterApiUpdate) => boolean
  save:           () => Promise<boolean>
  content:        string|null
  order:          number
  title:          string
  active:         boolean
  words:          number
  chapterDetail:  ChapterDetail
  isLoading:      boolean
  error:          any
  invalidate:     ()=>void
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