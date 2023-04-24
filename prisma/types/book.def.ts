import { Dispatch, SetStateAction } from "react"
import { Book, BookCategory, BookStatus, Chapter, Character, CyfrUser, Follow, Gallery, Genre, GenreListItem, Image, Like, Share, User, UserStub } from "../prismaContext"
import { KeyVal } from "../../types/props"

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


export type BookApiUpdate = {
  title?:       string | null
  startedAt?:   string | null
  completedAt?: string | null
  active?:      boolean
  prospect?:    boolean
  fiction?:     boolean
  status?:      BookStatus
  back?:        string | null
  synopsis?:    string | null
  hook?:        string | null
  genreId?:     string | null
}

export type BookApiRelations = 'Chapter' | 'Chapters' | 'Character' | 'Gallery'
type BookRelationsUpdate = {
  relation      : BookApiRelations
  genre?        : Genre
  chapter?      : Chapter
  chapters?     : Chapter[] 
  characters?   : Character[] 
  categories?   : BookCategory[] 
  cover?        : Image
}

/**
 * @property bookDetail {@link BookDetail}
 * @property genres {@link GenreListItem}[]
 * @property cyfrUser? {@link CyfrUser}
 */
export type BookApiProps = {
  bookDetail: BookDetail
  genres?:    GenreListItem[]
  cyfrUser?:  CyfrUser
}

/**
 * @property update {@link BookApi.update}
 */
export type BookApi = {
  by              : string
  isAuthor        : boolean
  isLoading       : boolean
  error           : any
  follow          : (followerId: string, isFan?: boolean) => Promise<boolean>
  like            : (userId: string) => Promise<boolean>
  share           : (userId: string) => Promise<boolean>
  save            : () => Promise<boolean>
  notEmpty        : (arr: Array<any> | undefined | null) => boolean
  cleanArray      : (arr: Array<any> | undefined | null) => Array<any>
  bookDetail      : BookDetail | null
  setBookDetail   : Dispatch<SetStateAction<BookDetail | null>>
  genres          : GenreListItem[]
  genresToOptions : KeyVal[]
  update          : (props: BookApiUpdate) => Promise<boolean | undefined>
  addChapter      : (title: string, order: number) => Promise<any>
  invalidate      : () => void
  saveChapter     : (chapter:Chapter) => Promise<boolean>
  sortChapters    : (chapter:Chapter) => Promise<boolean>
  chapters        : Chapter[]
  characters      : Character[]
  categories      : BookCategory[]
}