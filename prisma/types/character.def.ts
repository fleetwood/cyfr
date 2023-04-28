import { Book, BookDetail, BookStub, Chapter, ChapterStub, Character, CyfrUser, Follow, Gallery, GalleryStub, Like, Share, UserFollow } from "../prismaContext"

/**
 * @property characters {@link Character} TODO: should be a CharacterStub
 */
export type CharacterStub = Character & {
  books:      BookStub[]
  gallery:    GalleryStub
  characters: Character[]
}

/** 
 * @property characters {@link Character} TODO: should be a CharacterStub
 */
export type CharacterDetail = Character & {
  likes?:       Like[]
  follows?:     UserFollow[]
  shares?:      Share[]
  books?:       BookStub[]
  chapters?:    ChapterStub[]
  galleryId?:   string
  gallery?:     Gallery
}

export type CharacterUpsertProps = {
  id?:         string
  updatedAt?:  string
  active:      boolean
  name:        string
  familyName:  string
  givenName:   string
  middleName:  string
  thumbnail:   string
  age:         string
  role:        string
  description: string
  backstory:   string
  title:       string
  archetype:   string
  bookId:      string
}

export type CharacterApi = {
  save:             (props: CharacterApiUpdate) => Promise<CharacterDetail|null>
  characterDetail:  CharacterDetail|null
  isLoading:        boolean
  error:            any
  invalidate:       ()=>void
}

export type CharacterApiProps = {
  characterDetail:  CharacterDetail,
  cyfrUser?:        CyfrUser
}

export type CharacterApiUpdate = {
  id?:          string
  updatedAt?:   string
  active?:      boolean
  name?:        string
  familyName?:  string
  givenName?:   string
  middleName?:  string
  thumbnail?:   string
  age?:         string
  role?:        string
  description?: string
  backstory?:   string
  title?:       string
  archetype?:   string
}