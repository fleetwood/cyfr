
import { UseQueryResult, useQuery, useQueryClient } from "react-query"
import useDebug from "./useDebug"
import { BookDetail } from "../prisma/prismaContext"
import { getApi } from "../utils/api"
import { useState } from "react"

const { debug, info } = useDebug("BookDetailProvider", "DEBUG")

type UseBookDetails = {
  book:       BookDetail,
  isLoading:  boolean, 
  error:      any, 
  invalidate: Function
}

const useBookDetail = (bookId:string) => {
  const qc = useQueryClient()
  const getBookDetail = async () => {
    const bookDetail = await getApi(`/book/${bookId}`)
    return (bookDetail.result as BookDetail) || bookDetail.error || null
  }

  const [book, setBook] = useState<BookDetail|null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<any>()

  // @ts-ignore
  const onSettled = (data, error) => {
    // debug(`useBookDetail.onSettled()`)
    setIsLoading(() => false)
    if (error || data?.error || null) {
      info(`onSettled ERROR`, { error, data })
      setError(data.error)
    }
    if (data) {
      debug(`onSettled SUCCESS`, { book: data.title })
      setBook(() => data as BookDetail)
    }
  }

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
        }
        if (data) {
          debug(`onSettled`, data)
            setBook(data)
        }
      }
    }
  )

  return {
    book,
    isLoading,
    error,
    invalidate
  }
}

export default useBookDetail