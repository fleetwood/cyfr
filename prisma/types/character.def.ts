import { BookStub, BookStubInclude, ChapterStub, Character, CyfrUser, Gallery, GalleryStub, GalleriesStubInclude, LikesInclude, UserFollow, UserStub, UserStubSelect, GalleryStubInclude, LikesAndShares, LikesAndSharesInclude, ShareStubInclude } from "../prismaContext"

/**
 * @property characters {@link Character} TODO: should be a CharacterStub
 */
export type CharacterStub = Character & LikesAndShares & {
  authors:    UserStub[]
  books:      BookStub[]
  gallery:    GalleryStub
  // likes:      UserStub[]
}

// TODO: Stubs cannot include other stubs
export const CharacterStubInclude = { include: {
    authors: { select: {
      id: true,
      name: true,
      image: true,
      slug: true
    }},
    books: BookStubInclude,
    gallery: GalleryStubInclude
  },
  _count: {
    select: {
      shares: true
  }},
  shares: {
    ...ShareStubInclude,
    take: 10
  }
}

/** 
 * @property characters {@link Character} TODO: should be a CharacterStub
 */
export type CharacterDetail = Character & LikesAndShares & {
  follows?:     UserFollow[]
  likes:        UserStub[]
  books?:       BookStub[]
  chapters?:    ChapterStub[]
  galleryId?:   string
  gallery?:     Gallery
  _count: {
    select: {
      shares: true
  }},
  shares: {
    take: 10
  }
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