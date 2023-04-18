import { Dispatch, SetStateAction, useState } from "react"
import { BookDetail, BookStatus, CyfrUser, Genre, GenreListItem, PrismaBook } from "../prisma/prismaContext"
import { getApi, sendApi } from "../utils/api"
import useBookDetail from "./useBookDetail"
import useDebug from "./useDebug"
import { KeyVal } from "../types/props"

const {debug,err} = useDebug('hooks/useBookApi','DEBUG')

type BookApiUpdate = {
  title?:       string | null
  startedAt?:   string | null
  completedAt?: string | null
  active?:      boolean
  prospect?:    boolean
  fiction?:     boolean
  status?:      BookStatus
  genreId?:     string | null
  back?:        string | null
  synopsis?:    string | null
  hook?:        string | null
}

export type BookApiProps = {
  bookDetail: BookDetail
  genres:     GenreListItem[]
  cyfrUser?:  CyfrUser
}

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
  genresToOptions : () => KeyVal[]
  update          : (props: BookApiUpdate) => Promise<boolean | undefined>
  addChapter      : (title: string, order: number) => Promise<any>
  invalidate      : () => void
}

const useBookApi = (props:BookApiProps):BookApi => {
  debug('useBookApi')
  const {bookDetail, setBookDetail, isLoading, error, invalidate} = useBookDetail(props.bookDetail.id)
  const [genres, setGenres] = useState<GenreListItem[]>(props.genres)

  const genresToOptions = ():KeyVal[] => genres.map(g => { return { key: g.title, value: g.id }})

  const notEmpty = (arr: Array<any> | undefined | null) => arr !== undefined && arr !== null && arr.length > 0

  const cleanArray = (arr:Array<any> | undefined | null):Array<any> => arr ? arr.filter(a => a!== undefined && a !== null) : []

  const noBookDetail = (method:string) => {
    debug(method, 'bookDetail is null')
    return false
  }

  const by = (bookDetail?.authors??[]).flatMap(author => author.name).join(' and ')
  //todo: This should be handled by a commune...
  const isAuthor = (bookDetail?.authors??[]).filter(a => a.id === props.cyfrUser?.id).length > 0

  /**
   * Be careful with this, as we are using {@link PrismaBook.upsert} for the save operation,
   * so props like {@link BookDetail.title} cannot be *null*.
   * @param title: {string|null}
   * @param startedAt: {string|null} - NOTE: This is in date format *YYYY-MM-DD hh:mm:ss.sss*
   * @param completedAt: {string|null} - NOTE: This is in date format *YYYY-MM-DD hh:mm:ss.sss*
   * @param active: {boolean}
   * @param prospect: {boolean}
   * @param fiction: {boolean}
   * @param status: {@link BookStatus}
   * @param genreId: {string|null}
   * @param back: {string|null}
   * @param synopsis: {string|null}
   * @param hook: {string|null}
   */
  const update = async (props:BookApiUpdate) => {
    if (!bookDetail) return noBookDetail('update')
    debug('update',{fiction: bookDetail.fiction, prospect: bookDetail.prospect, active: bookDetail.active,props})
    const newBook:BookDetail = {
      ...bookDetail,
      ...props,
      genreId: props.genreId??bookDetail.genreId,
      title: props.title??bookDetail.title
    }
    setBookDetail(newBook)
  }
  
  const follow = async (followerId:string, isFan=false) => {
    if (!bookDetail) return noBookDetail('follow')
    const upsert = await (await sendApi("book/follow", {
        bookId: bookDetail.id,
        followerId,
        isFan
    })).data
    if (upsert.result) {
      invalidate()
      return true
    }
    else {
        debug('Did not get right result?', upsert.result)
        return false
    }
  }

  const like = async (userId:string) => {
    if (!bookDetail) return noBookDetail('like')
    const upsert = await (await sendApi("book/like", {
        bookId: bookDetail.id,
        authorId: userId
    })).data
    if (upsert.result) {
      invalidate()
      return true
    }
    else {
        debug('Did not get right result?', upsert.result)
        return false
    }
  }
  
  const share = async (userId:string) => {
    if (!bookDetail) return noBookDetail('share')
    const upsert = await (await sendApi("book/share", {
        bookId: bookDetail.id,
        authorId: userId
    })).data
    if (upsert.result) {
      invalidate()
      return true
    }
    else {
        debug('Did not get right result?', upsert.result)
        return false
    }
  }
  
  const save = async () => {
    if (!bookDetail) return noBookDetail('save')
    debug('save',{fiction: bookDetail.fiction, prospect: bookDetail.prospect, active: bookDetail.active})
    const upsert = await (await sendApi("book/upsert", bookDetail)).data
    if (upsert.result) {
      const b = upsert.result
      debug('result', {fiction: b.fiction, prospect: b.prospect, active: b.active})
      invalidate()
      return true
    }
    else {
      debug('Did not get right result?', upsert)
      return false
    }
  }

  const addChapter = async (title:string, order:number) => {
    if (!bookDetail) return noBookDetail('addChapter')
    const props = {bookid: bookDetail.id, title, order}
    const result = await (await sendApi('/book/addChapter', props)).data
    if (result.result) {
      invalidate()
      return result.result
    } else {
      debug('Did not get right result?', {props})
      return false
    }
  }

  return {
    by,
    isAuthor,
    follow,
    like,
    share,
    save,
    notEmpty,
    cleanArray,
    bookDetail,
    setBookDetail,
    genres,
    genresToOptions,
    update,
    addChapter,
    isLoading, 
    error, 
    invalidate
  } as BookApi
}

export default useBookApi