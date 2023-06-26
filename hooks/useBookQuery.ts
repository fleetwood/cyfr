
import { useQuery, useQueryClient } from "react-query"
import { BookDetail } from "prisma/prismaContext"
import { getApi } from "utils/api"
import useDebug from "./useDebug"

const { debug } = useDebug("useBookQuery")

type RktBookQuery = {
  data:       any
  isLoading:  boolean
  error:      any
  invalidate:   () => void
}

type UseBookQueryProps = {
  bookId?:    string
  bookSlug?:  string
}

const useBookQuery = ({bookId, bookSlug}:UseBookQueryProps):RktBookQuery => {

  if (!bookId && !bookSlug) {
    debug('getBookDetail bookId and bookSlug are both null')
    return {
      data: {},
      isLoading: false,
      error: {
        message: 'UseBookQueryProps not available'
      },
      invalidate: () => {}
    } as RktBookQuery
  }

  const qc = useQueryClient()
  const bookQuery = ["bookDetail", `bookDetail-${bookId||bookSlug}`]
  const url = bookSlug ? `/book/slug/${bookSlug}` : `/book/${bookId}`

  const getBookDetail = async () => {
    debug('getBookDetail', {bookSlug, bookId, bookQuery, url})
    const bookDetail = await getApi(url)
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
          debug(`onSettled [${bookQuery}]`, {book: book.title, url})
          return book ?? undefined
        }
      }
    }
  )

  return {...query, invalidate} as RktBookQuery
}

export default useBookQuery