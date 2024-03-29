
import useDebug from "../../hooks/useDebug"
import { NotImplemented, sendApi } from "../../utils/api"
import { isAuthor } from '../../utils/helpers/book'
import {
  Chapter,
  ChapterDetail,
  ChapterStub,
  Gallery,
} from "../prismaContext"

const { debug, fileMethod } = useDebug("hooks/useChapterApi")

const useChapterApi = () => {

  const save = async (chapter: ChapterDetail): Promise<ChapterDetail | null> => await ( await sendApi("chapter/upsert", { chapter })).data

  const detail = async (id: string): Promise<ChapterDetail | null> => await (await sendApi("chapter/detail", id)).data

  const stub = async (id: string): Promise<ChapterStub | null> => await (await sendApi("chapter/stub", id)).data

  const addGallery = async (id: string,gallery: Gallery): Promise<Gallery | null> => {throw NotImplemented(fileMethod('addGallery'))}

  const sort = async (changedChapter: Chapter): Promise<Boolean> => {throw NotImplemented(fileMethod('sort'))}

  return {
    stub,
    detail,
    save,
    sort,
    addGallery,
    isAuthor
  }
}

export default useChapterApi
