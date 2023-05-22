
import { useQuery, useQueryClient } from "react-query"
import { BookDetail, BookDetailHook } from "../prisma/prismaContext"
import { getApi } from "../utils/api"
import useDebug from "./useDebug"

const { debug, info } = useDebug("useBookQuery", 'DEBUG')

const useBookQuery = (bookId:string) => {
  const qc = useQueryClient()
  const bookQuery = `bookDetail-${bookId}`
  const getBookDetail = async () => {
    if (!bookId) {
      debug('getBookDetail bookId is null')
      return null
    }
    debug('getBookDetail', {url: `/book/${bookId}`})
    const bookDetail = await getApi(`/book/${bookId}`)
    return (bookDetail.result as BookDetail) || bookDetail.error || null
  }

  const invalidate = () => {
    info('invalidate',[bookQuery])
    qc.invalidateQueries([bookQuery])
  }

  const query = useQuery(
    ["bookDetail", bookQuery],
    getBookDetail,
    {
      onSettled(data: any,error: any) {
        if (error || data === null) {
          debug(`onSettled ${["bookDetail", bookQuery]} ERROR`, { error, data })
        }
        if (data) {
          debug(`onSettled`, {book: data.title??'No book returned'})
          return data
        }
      }
    }
  )

  return {...query, invalidate}
}

export default useBookQuery