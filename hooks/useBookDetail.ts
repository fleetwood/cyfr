
import { Dispatch, SetStateAction, useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { BookApi, BookDetail, CyfrUser } from "../prisma/prismaContext"
import { getApi } from "../utils/api"
import useDebug from "./useDebug"

const { debug, info } = useDebug("BookDetailProvider")

export type BookDetailHook = {
  bookDetail:     BookDetail | null
  setBookDetail:  Dispatch<SetStateAction<BookDetail | null>>
  isLoading:      boolean
  error:          any
  by:             string
  isAuthor:       boolean
  api:            any
  invalidate:     () => void
}

const useBookDetail = (bookId:string, cyfrUser:CyfrUser) => {
  const qc = useQueryClient()
  const getBookDetail = async () => {
    if (!bookId) return null
    const bookDetail = await getApi(`/book/${bookId}`)
    return (bookDetail.result as BookDetail) || bookDetail.error || null
  }

  const [bookDetail, setBookDetail] = useState<BookDetail|null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<any>()

  const by = (bookDetail?.authors??[]).flatMap(author => author.name).join(' and ')
  //todo: This should be handled by a commune...
  const isAuthor = cyfrUser ? (bookDetail?.authors??[]).filter(a => a.id === cyfrUser?.id).length > 0 : false

  const invalidate = () => {
    info('invalidate',["bookDetail", bookId])
    qc.invalidateQueries(["bookDetail", bookId])
  }

  const query = useQuery(
    ["bookDetail", bookId],
    getBookDetail,
    {
      onSettled(data: any,error: any) {
        setIsLoading(false)
        if (error || data === null) {
          info(`onSettled ${["bookDetail", bookId]} ERROR`, { error, data })
          setError(error)
        }
        if (data) {
          debug(`onSettled`, data)
            setBookDetail(data)
        }
      }
    }
  )

  return {
    bookDetail,
    setBookDetail,
    isLoading,
    error,
    invalidate,
    by, 
    isAuthor
  } as BookDetailHook
}

export default useBookDetail