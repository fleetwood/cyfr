import { useQueryClient } from "react-query"
import { Chapter, ChapterApi, ChapterApiProps, ChapterApiUpdate, ChapterDetail, CyfrUser } from "../prisma/prismaContext"
import { sendApi } from "../utils/api"
import useChapterDetail from "./useChapterDetail"
import useDebug from "./useDebug"

const {debug, info, err} = useDebug('hooks/useChapterApi','DEBUG')
const noChapterDetail = (method:string) => {
  debug(method, `There is no chapterDetail present in useChapterApi...`)
  return false
}

/**
 * Obtains the ChapterDetail from Web API.
 * @param chapterId: string
 * @param cyfrUser?:  {@link CyfrUser} 
 * @returns 
 */
const useChapterApi = (props:ChapterApiProps):ChapterApi => {
  const {chapterDetail, setChapterDetail, isLoading, error, invalidate} = useChapterDetail(props.chapterDetail.id)

  const qc = useQueryClient()

  /**
   * READ-ONLY VALUES
   */
  const {content, order, title, active, words} = chapterDetail ?? {}

  const upsert = async (chapter:ChapterDetail):Promise<ChapterDetail|null> => {
    debug('upsert', chapter)
    const result = await sendApi('chapter/upsert', {chapter})
    if (result) {
      return result as unknown as ChapterDetail
    }
    else return null
  }

  const detail = async (id:string) => {
    debug('detail', id)
    const result = await sendApi('chapter/detail', id)
    return result|| null
  }

  const stub = async (id:string) => {
    debug('stub', id)
    const result = await sendApi('chapter/stub', id)
    return result|| null
  }

  //////////////////////////////////////////////`
  ///  METHODS   ///////////////////////////////
  //////////////////////////////////////////////`
  /**
   * Be careful with this, as we are using {@link PrismaChapter.upsert} for the save operation,
   * so props like {@link ChapterDetail.title} cannot be *null*. Also, cannot use this for 
   * {connectOrCreate} 
   * @param props: {@link ChapterApiUpdate}
   * @property title: string|null
   * @property active: boolean
   * @property order: number
   * @property words: number
   * @property content: {string|null}
   */
  const save = async (props:ChapterApiUpdate):Promise<ChapterDetail|null> => {
    if (!chapterDetail) {
      noChapterDetail('update')
      return null
    }
    const updateChapter:ChapterDetail = {
      ...chapterDetail,
      ...props,
      title: props.title??chapterDetail.title
    }
    debug('update', updateChapter)
    return upsert(updateChapter)
  }

  return {
    save,
    chapterDetail,
    isLoading,
    error,
    invalidate
  }
}

export default useChapterApi