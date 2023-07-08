import { Dispatch, SetStateAction } from "react"
import { RocketQuery } from "../../types/props"
import { BookDetail, BookStub, Chapter, Character, CharacterStub, CyfrUser, Gallery, GalleryStub, GenreStub, UserStub } from "../prismaContext"

export type ChapterListItem = {
  id:     string
  order:  number
  title:  string
  words:  number
  visible: true
}

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
  book:         BookStub
  gallery?:     GalleryStub
  characters?:  CharacterStub[]
}

export type ChapterDetailApi = {
  save:       (chapterDetail: ChapterDetail) => Promise<ChapterDetail | null>
  stub:       (id:string) => Promise<ChapterStub|null>
  detail:     (id: string) => Promise<ChapterDetail | null>
  addGallery: (id:string, gallery:Gallery) => Promise<Gallery | null>
  sort:       (changedChapter: Chapter) => Promise<Boolean>
}

export type ChapterApiProps = {
  bookDetail:     BookDetail
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

export type ChapterDetailState = {
  id: string
  // createdAt: Date;
  createdAt: string
  // updatedAt: Date;
  updatedAt: string, 
  setUpdatedAt: Dispatch<SetStateAction<string>>
  // active: boolean;
  active: boolean,
  setActive: Dispatch<SetStateAction<boolean>>
  // title: string;
  title: string, 
  setTitle: Dispatch<SetStateAction<string>>
  // content: string;
  content: string,
  setContent: Dispatch<SetStateAction<string>>
  // words: number;// back: string | null;
  words: number, 
  setWords: Dispatch<SetStateAction<number>>
  // order: number;// back: string | null;
  order: number
  setOrder: Dispatch<SetStateAction<number>>
  // bookId: string | null;
  bookId: string,
  setBookId: Dispatch<SetStateAction<string>>
  // galleryId: string | null;
  galleryId: string, 
  setGalleryId: Dispatch<SetStateAction<string>>
  isAuthor: boolean
}

export type ChapterRelations = {
  genre:        GenreStub,
  gallery?:     GalleryStub[],
  authors:      UserStub[],
  likes?:       UserStub[],
  characters?:  CharacterStub[],
}

export type ChapterDetailHook = {
  chapterDetail:  ChapterDetail | null
  query:          RocketQuery<ChapterDetail>
  api:            ChapterDetailApi
  state:          ChapterDetailState
  relations:      ChapterRelations
}

export const ChapterStubInclude = {
  book: {
    include: {
      authors: true
    }
  },
  gallery: true,
  characters: true
}

export const ChapterDetailInclude = {
  ...ChapterStubInclude
}