import { BookStub, BookStubInclude, ChapterStub, Character, CyfrUser, Gallery, GalleryStub, GalleryStubInclude, LikesInclude, UserFollow, UserStub, UserStubSelect } from "../prismaContext"

/**
 * @property characters {@link Character} TODO: should be a CharacterStub
 */
export type CharacterStub = Character & {
  authors:    UserStub[]
  books:      BookStub[]
  gallery:    GalleryStub
  likes:      UserStub[]
}

export const CharacterStubInclude = {
  authors: UserStubSelect,
  books: BookStubInclude,
  gallery: GalleryStubInclude,
  likes: LikesInclude
}

/** 
 * @property characters {@link Character} TODO: should be a CharacterStub
 */
export type CharacterDetail = Character & {
  follows?:     UserFollow[]
  likes:        UserStub[]
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