import { BookDetail, BookStatus } from "../prisma/prismaContext"
import useDebug from "./useDebug"
import { sendApi } from "../utils/api"
import { useState } from "react"
import { useQueryClient } from "react-query"
import useBookDetail from "./useBookDetail"

const {debug} = useDebug('hooks/useBookApi','DEBUG')

const useBookApi = (bookDetail:BookDetail) => {
  const [book, setBookState] = useState<BookDetail>(bookDetail)
  const {invalidate} = useBookDetail(bookDetail.id)

  type BookApiUpdate = {
    // title?:       string | null
    startedAt?:   string | null
    completedAt?: string | null
    active?:      boolean
    prospect?:    boolean
    fiction?:     boolean
    status?:      BookStatus
    back?:        string | null
    synopsis?:    string | null
    hook?:        string | null
  }

  const update = async (props:BookApiUpdate) => {
    debug('update',{fiction: book.fiction, prospect: book.prospect, active: book.active,props})
    const newBook:BookDetail = {
      ...book,
      ...props
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

  return {
    follow,
    like,
    share,
    save,
    book,
    update,
    invalidate
  }
}

export default useBookApi