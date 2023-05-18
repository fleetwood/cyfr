import { Dispatch, SetStateAction, useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import ChapterApi from "../prisma/api/chapter"
import { BookDetail, ChapterDetail, ChapterDetailApi, ChapterDetailState, ChapterRelations, CyfrUser } from "../prisma/prismaContext"
import { sendApi } from "../utils/api"
import { now } from "../utils/helpers"
import useDebug from "./useDebug"
import { RocketQuery } from "../types/props"

const { debug, info } = useDebug("hooks/useChapterDetail")

export type ChapterDetailHook = {
  bookDetail?:      BookDetail
  chapterDetail?:   ChapterDetail|null
  query:            RocketQuery
  api:              ChapterDetailApi
  state:            ChapterDetailState
}

type ChapterDetailProps = {
  bookDetail: BookDetail
  chapterId:  string
  cyfrUser:   CyfrUser
}

const useChapterDetail = ({bookDetail, chapterId, cyfrUser}:ChapterDetailProps):ChapterDetailHook => {
  const qc = useQueryClient()
  const getChapterDetail = async () => {
    if (!chapterId) return null
    const chapterDetail = await sendApi(`chapter/detail`,{id:chapterId})
    if (chapterDetail.data) {
      return (chapterDetail.data as ChapterDetail)
    }
    return null
  }
  
  const [chapterDetail, setChapterDetail] = useState<ChapterDetail|null>(null)

  // // STATE
  // id: string;
  const id = chapterDetail?.id
  // createdAt: Date;
  const createdAt = chapterDetail?.createdAt.toDateString()??''
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

  const api = ChapterApi()

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
            setChapterDetail(data.result)
        }
      }
    }
  )

  return {
    chapterDetail,
    api,
    query: {
      error, 
      isLoading,
      invalidate
    },
    // pass-thru properties
    state: {
      id, createdAt, 
      updatedAt, setUpdatedAt,
      active, setActive,
      title, setTitle,
      content, setContent,
      order, setOrder,
      words, setWords,
      // RELATIONS
      bookId, setBookId,
      galleryId, setGalleryId,
      isAuthor
    },
    // relations
    relations: {
      gallery, characters
    }
  } as ChapterDetailHook
}

export default useChapterDetail