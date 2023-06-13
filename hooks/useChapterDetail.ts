import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import useChapterApi from "../prisma/hooks/useChapterApi"
import { BookDetail, ChapterDetail, ChapterDetailApi, ChapterDetailState, CyfrUser } from "../prisma/prismaContext"
import { RocketQuery } from "../types/props"
import { sendApi } from "../utils/api"
import { now } from "../utils/helpers"
import useDebug from "./useDebug"

const { debug, info } = useDebug("hooks/useChapterDetail")

export type ChapterDetailHook = {
  bookDetail:      BookDetail
  chapterDetail:   ChapterDetail|null
  query:            RocketQuery<BookDetail>
  api:              ChapterDetailApi
  state:            ChapterDetailState
}

type ChapterDetailProps = {
  bookDetail: BookDetail
  chapterId:  string
  cyfrUser:   CyfrUser
}

const useChapterDetail = ({bookDetail, chapterId, cyfrUser}:ChapterDetailProps) => {
  debug('useChapterDetail', {book: bookDetail.title, chapterId, cyfrUser: cyfrUser?.name??'Not logged in'})
  const qc = useQueryClient()
  const [chapterDetail, setChapterDetail] = useState<ChapterDetail|null>(null)

  // // STATE
  // id: string;
  const id = chapterDetail?.id
  // createdAt: Date;
  const createdAt = chapterDetail?.createdAt ?? ''
  // updatedAt: Date;
  const [updatedAt, setUpdatedAt] = useState<string>(now.toString())
  // active: boolean;
  const [active, setActive] = useState<boolean>((chapterDetail?.active??false))
  // title: string;
  const [title, setTitle] = useState<string>(chapterDetail?.title??'')
  // content: string;
  const [content, setContent] = useState<string>(chapterDetail?.content??'')
  // words: number;// back: string | null;
  const [words, setWords] = useState<number>(chapterDetail?.words??0)
  // order: number;// back: string | null;
  const [order, setOrder] = useState<number>(chapterDetail?.order??0)
  // bookId: string | null;
  const [bookId, setBookId] = useState<string>(chapterDetail?.bookId??'')
  // galleryId: string | null;
  const [galleryId, setGalleryId] = useState<string>(chapterDetail?.galleryId??'')

  // RELATIONS
  // Read-only
  const { gallery, characters } = chapterDetail??{}

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<any>()

  const isAuthor = cyfrUser ? (bookDetail?.authors??[]).filter(a => a.id === cyfrUser?.id).length > 0 : false

  const api = useChapterApi()

  const getChapterDetail = async () => {
    if (!chapterId) return null
    debug('rkt query', {chapterId, book:bookDetail?.title??'undefined', cyfrUser: cyfrUser?.name ?? 'not logged in'})
    const chapterDetail = await sendApi('chapter/detail', {chapterId})
    if (chapterDetail.data) {
      return (chapterDetail.data as ChapterDetail)
    }
    return null
  }
  const invalidate = () => {
    info('invalidate',["chapterDetail", chapterId])
    qc.invalidateQueries(["chapterDetail", chapterId])
  }

  const query = useQuery(
    ["chapterDetail", chapterId],
    getChapterDetail,
    {
      onSettled(data: any,error: any) {
        setIsLoading(false)
        if (error || data === null) {
          info(`onSettled ${["chapterDetail", chapterId]} ERROR`, { error, data })
          setError(error)
        }
        if (data?.result) {
          debug(`onSettled`, data.result)
          const detail = data.result
            setChapterDetail(() => detail)
            setTitle(() => detail.title??'')
        }
      }
    }
  )

  return {
    chapterDetail,
    bookDetail,
    api 
  }
}

export default useChapterDetail