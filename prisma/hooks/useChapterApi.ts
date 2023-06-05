
import useDebug from "../../hooks/useDebug"
import { NotImplemented, sendApi } from "../../utils/api"
import {
  Chapter,
  ChapterDetail,
  ChapterDetailApi,
  ChapterStub,
  Gallery,
  Share,
} from "../prismaContext"
import {isAuthor} from '../../utils/helpers/book'

const { debug, info, err } = useDebug("hooks/useChapterApi")
const noChapterDetail = (method: string) => {
  debug(method, `There is no chapterDetail present in useChapterApi...`)
  return false
}

const useChapterApi = () => {

  const save = async (chapter: ChapterDetail): Promise<ChapterDetail | null> => await ( await sendApi("chapter/upsert", { chapter })).data

  const detail = async (id: string): Promise<ChapterDetail | null> => await (await sendApi("chapter/detail", id)).data

  const stub = async (id: string): Promise<ChapterStub | null> => await (await sendApi("chapter/stub", id)).data

  const share = async (id: string): Promise<Share | null> => {throw NotImplemented}

  const addGallery = async (id: string,gallery: Gallery): Promise<Gallery | null> => {throw NotImplemented}

  const sort = async (changedChapter: Chapter): Promise<Boolean> => {throw NotImplemented}

  return {
    stub,
    detail,
    save,
    sort,
    share,
    addGallery,
    isAuthor
  }
}

export default useChapterApi
