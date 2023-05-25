
import { useQuery, useQueryClient } from "react-query"
import { BookDetail } from "../prisma/prismaContext"
import { getApi } from "../utils/api"
import useDebug from "./useDebug"

const { debug, info } = useDebug("useBookQuery")

type RktBookQuery = {
  data:       any
  isLoading:  boolean
  error:      any
  invalidate:   () => void
}

const useBookQuery = (bookId:string):RktBookQuery => {

  if (!bookId) {
    debug('getBookDetail bookId is null')
    return {
      data: {},
      isLoading: false,
      error: {
        message: 'Param bookId is not available'
      },
      invalidate: () => {}
    } as RktBookQuery
  }

  const qc = useQueryClient()
  const bookQuery = ["bookDetail", `bookDetail-${bookId}`]

  const getBookDetail = async () => {
    debug(`getBookDetail  ${bookQuery}`, {url: `/book/${bookId}`})
    const bookDetail = await getApi(`/book/${bookId}`)
    return (bookDetail.result as BookDetail) || bookDetail.error || null
  }

  const invalidate = () => {
    debug('invalidate',bookQuery)
    qc.invalidateQueries(bookQuery)
  }

  const query = useQuery(
    bookQuery,
    getBookDetail,
    {
      onSettled(data: any,error: any) {
        if (error || data === null) {
          debug(`onSettled [${bookQuery}] ERROR`, { error, data })
        }
        if (data) {
          const book = data.result ?? data
          debug(`onSettled [${bookQuery}]`, {book})
          return book ?? undefined
        }
      }
    }
  )

  return {...query, invalidate} as RktBookQuery
}

export default useBookQuery