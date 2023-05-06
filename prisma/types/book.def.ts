import { Dispatch, SetStateAction } from "react"
import { Book, BookCategory, BookStatus, Chapter, ChapterStub, Character, CharacterStub, CyfrUser, Follow, Gallery, GalleryStub, Genre, GenreStub, Image, Like, Share, User, UserStub } from "../prismaContext"
import { KeyVal } from "../../types/props"
import useBookApi from "../../hooks/useBookApi"

// TODO Create/Verify view in db
export type BookStub = Book & {
  likes:      number
  shares:     number
  follows:    number
  chapters:   Chapter[]
  characters: Character[]
  // relations
  authors:    UserStub[],
  cover?:     Image
  genre:      Genre
  categories: BookCategory[]
}

// TODO Create/Verify view in db
export type BookDetail = Book & {
  genre:      Genre
  //TODO: Gallery should be stub
  gallery:    Gallery
  authors:    UserStub[]
  cover:      Image
  likes:      Like[]
  follows:    Follow[]
  shares:     Share[]
  chapters:   ChapterStub[]
  characters: CharacterStub[]
  categories: BookCategory[]
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

// TODO This does not account for startedAt and completeAt bc @#$@#$ Date -> String
export type BookApiUpdate = {
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
 * @property genres {@link GenreStub}[]
 * @property cyfrUser? {@link CyfrUser}
 */
export type BookApiProps = {
  bookDetail: BookDetail
  genres?:    GenreStub[]
  cyfrUser?:  CyfrUser
}


/**
 * 
 * @description Type for the {@link useBookApi} hook. 
 * @export
 * @typedef {BookApi}
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
  genres          : GenreStub[]
  genresToOptions : KeyVal[]
  update          : (props: BookApiUpdate) => Promise<boolean | undefined>
  addChapter      : (title: string, order: number) => Promise<any>
  addGallery      : (galleryId: string) => Promise<any>
  invalidate      : () => void
  saveChapter     : (chapter:Chapter) => Promise<boolean>
  sortChapters    : (chapter:Chapter) => Promise<boolean>
  chapters        : Chapter[]
  characters      : Character[]
  categories      : BookCategory[]
}