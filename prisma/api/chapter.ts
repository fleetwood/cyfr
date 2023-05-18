
import useDebug from "../../hooks/useDebug"
import { sendApi } from "../../utils/api"
import {
  Chapter,
  ChapterDetail,
  ChapterDetailApi,
  ChapterStub,
  Gallery,
  Share,
} from "../prismaContext"

const { debug, info, err } = useDebug("hooks/useChapterApi", "DEBUG")
const noChapterDetail = (method: string) => {
  debug(method, `There is no chapterDetail present in useChapterApi...`)
  return false
}

/**
 * Obtains the ChapterDetail from Web API.
 * @param chapterId: string
 * @param cyfrUser?:  {@link CyfrUser}
 * @returns
 */
const ChapterApi = (): ChapterDetailApi => {
  const save = async (
    chapter: ChapterDetail
  ): Promise<ChapterDetail | null> => {
    debug("upsert", chapter)
    const result = await sendApi("chapter/upsert", { chapter })
    if (result) {
      return result as unknown as ChapterDetail
    } else return null
  }

  const detail = async (id: string): Promise<ChapterDetail | null> => {
    debug("detail", id)
    const result = await sendApi("chapter/detail", id)
    return (result as unknown as ChapterDetail) || null
  }

  const stub = async (id: string): Promise<ChapterStub | null> => {
    debug("stub", id)
    const result = await sendApi("chapter/stub", id)
    return (result as unknown as ChapterStub) || null
  }

  const share = async (id: string): Promise<Share | null> => {
    throw "Not yet Implemented"
  }

  const addGallery = async (id: string,gallery: Gallery): Promise<Gallery | null> => {
    throw "Not yet Implemented"
  }

  const sort = async (changedChapter: Chapter): Promise<Boolean> => {
    throw "Not yet Implemented"
  }

  return {
    stub,
    detail,
    save,
    sort,
    share,
    addGallery
  }
}

export default ChapterApi
