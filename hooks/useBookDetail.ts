
import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { BookDetail } from "../prisma/prismaContext"
import { getApi } from "../utils/api"
import useDebug from "./useDebug"

const { debug, info } = useDebug("BookDetailProvider")

const useBookDetail = (bookId:string) => {
  const qc = useQueryClient()
  const getBookDetail = async () => {
    if (!bookId) return null
    const bookDetail = await getApi(`/book/${bookId}`)
    return (bookDetail.result as BookDetail) || bookDetail.error || null
  }

  const [book, setBook] = useState<BookDetail|null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<any>()

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