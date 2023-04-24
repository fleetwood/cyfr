import { Dispatch, SetStateAction } from "react"
import { BookDetail, BookStatus, Image, Chapter, Character, CyfrUser, Genre, GenreListItem, BookCategory } from "../prisma/prismaContext"
import { KeyVal } from "./props"

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