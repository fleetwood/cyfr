
import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { ChapterDetail } from "../prisma/prismaContext"
import { getApi, sendApi } from "../utils/api"
import useDebug from "./useDebug"

const { debug, info } = useDebug("hooks/useChapterDetail")

const useChapterDetail = (chapterId:string) => {
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
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<any>()

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
    setChapterDetail,
    isLoading,
    error,
    invalidate
  }
}

export default useChapterDetail