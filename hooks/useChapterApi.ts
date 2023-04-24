import { useQueryClient } from "react-query"
import { ChapterWebApiProps } from "../pages/api/chapter"
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
const useChapterApi = (props:ChapterApiProps) => {
  debug('useChapterApi')

  const {chapterDetail, setChapterDetail, isLoading, error, invalidate} = useChapterDetail(props.chapterDetail.id)

  const qc = useQueryClient()

  /**
   * READ-ONLY VALUES
   */
  const {content, order, title, active, words} = chapterDetail ?? {}

  //////////////////////////////////////////////
  ///  CRUD   //////////////////////////////////
  //////////////////////////////////////////////
  const sendChapterApi = async (props:ChapterWebApiProps) => sendApi('/chapter', props)

  const upsert = async (chapter:ChapterDetail|Chapter) => {
    debug('upsert', chapter)
    const result = await sendChapterApi({method: 'UPSERT', chapter})
    return result|| null
  }

  const detail = async (id:string) => {
    debug('detail', id)
    const result = await sendChapterApi({method: 'DETAIL', id})
    return result|| null
  }

  const stub = async (id:string) => {
    debug('stub', id)
    const result = await sendChapterApi({method: 'STUB', id})
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
  const update = async (props:ChapterApiUpdate) => {
    if (!chapterDetail) return noChapterDetail('update')
    debug('update',{title, active, order, words, content, props})
    const updateChapter:ChapterDetail = {
      ...chapterDetail,
      ...props,
      title: props.title??chapterDetail.title
    }
    setChapterDetail(updateChapter)
  }

  const save = async () => upsert(chapterDetail!)

  return {
    update,
    save,
    content,
    order,
    title,
    active,
    words,
    chapterDetail,
    isLoading,
    error,
    invalidate
  } as unknown as ChapterApi
}

export default useChapterApi