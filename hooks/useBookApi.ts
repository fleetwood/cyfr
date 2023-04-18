import { useState } from "react"
import { BookDetail, BookStatus, Genre, PrismaBook } from "../prisma/prismaContext"
import { getApi, sendApi } from "../utils/api"
import useBookDetail from "./useBookDetail"
import useDebug from "./useDebug"
import { KeyVal } from "../types/props"

const {debug} = useDebug('hooks/useBookApi','DEBUG')

const useBookApi = (bookDetail:BookDetail) => {
  const [book, setBookState] = useState<BookDetail>(bookDetail)
  const [genres, setGenres] = useState<Genre[]>([])

  const genresToOptions = ():KeyVal[] => genres.map(g => { return { key: g.title, value: g.id }})

  const {invalidate} = useBookDetail(bookDetail.id)

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
    debug('update',{fiction: book.fiction, prospect: book.prospect, active: book.active,props})
    const newBook:BookDetail = {
      ...book,
      ...props,
      genreId: props.genreId??book.genreId,
      title: props.title??book.title
    }
    setBookState(newBook)
  }
  
  const follow = async (followerId:string, isFan=false) => {
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
    debug('save',{fiction: book.fiction, prospect: book.prospect, active: book.active})
    const upsert = await (await sendApi("book/upsert", book)).data
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

  const getGenres = async () => {
    const results = await getApi('/genre/list')
    if (results.result) {
      setGenres(results.result)
    }
  }

  getGenres()

  return {
    follow,
    like,
    share,
    save,
    book,
    genres,
    genresToOptions,
    update,
    invalidate
  }
}

export default useBookApi