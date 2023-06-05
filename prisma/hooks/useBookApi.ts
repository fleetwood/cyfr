import useDebug from "../../hooks/useDebug"
import { NotImplemented, getApi, sendApi } from "../../utils/api"
import { isAuthor } from '../../utils/helpers/book'
import { BookDetail, BookEngageProps, BookFollowProps, Chapter } from "../prismaContext"

const { debug, info, err } = useDebug("hooks/useBookApi", 'DEBUG')

debug("BookApi")

const noBookDetail = (method: string) => {
  debug(method, "bookDetail is null")
  return false
}

const useBookApi = () => {

  const follow = async (props:BookFollowProps):Promise<boolean> => await (await sendApi("book/follow", props)).data

  const share = async (props: BookEngageProps):Promise<boolean> => await (await sendApi("book/share", props)).data

  const like = async (props: BookEngageProps):Promise<boolean>  => await (await sendApi("book/like", props)).data

  // const update = async (bookDetail:BookDetail, props:BookApiProps, autoSave) => {
  //   if (!bookDetail) return noBookDetail('update')
  //   debug('update',{fiction: bookDetail.fiction, prospect: bookDetail.prospect, active: bookDetail.active,props, genre: bookDetail.genre})
  //   const newBook:BookDetail = {
  //     ...bookDetail!,
  //     ...props,
  //     genreId: props.genreId??bookDetail.genreId,
  //     title: props.title??bookDetail.title
  //   }
  //   setBookDetail(newBook)
  //   if (autoSave) (
  //     save()
  //   )
  // }

  const save = async (detail?:BookDetail) => {
    if (!detail) return noBookDetail("save")
    const {back, synopsis, active, prospect, fiction, title, slug, words, completeAt} = detail
    debug("save", {back, synopsis, active, prospect, fiction, title, slug, words, completeAt})
    const upsert = await (await sendApi("book/upsert", detail)).data
    if (upsert.result) {
      const b = upsert.result
      debug("result", {
        fiction: b.fiction,
        prospect: b.prospect,
        active: b.active,
        completeAt: b.completeAt
      })
      return true
    } else {
      debug("Did not get right result?", upsert)
      return false
    }
  }

  const updateGenre = async (
    genreId: string
  ): Promise<boolean> => {
    debug("updateGenre", genreId)
    throw NotImplemented
    // const bd = { ...bookDetail, genreId }
    // const upsert = await (await sendApi("book/upsert", bd)).data
    // if (upsert.result) {
    //   debug("result", { ...upsert.result })
    //   return true
    // } else {
    //   debug("Did not get right result?", upsert)
    //   return false
    // }
  }

  const addGallery = async (bookId: string, galleryId?: string) => {
    if (!galleryId) return false
    const result = await (
      await sendApi("/book/addGallery", { galleryId, bookId })
    ).data
    if (result.result) {
      return result.result
    } else {
      debug("Did not get right result?")
      return false
    }
  }

  const sortChapters = async (changedChapter: Chapter): Promise<Boolean> => {
    debug("sortChapters")
    throw NotImplemented
    // if (!bookDetail) return noBookDetail("sortChapters")
    // const result = await sendApi("/chapter/sort", {
    //   currentChapters: bookDetail.chapters,
    //   changedChapter,
    // })
    // if (result) {
    //   return true
    // }
    // debug("sortChapters FAIL")
    // return false
  }

  const addChapter = async (
    bookId: string,
    title: string,
    order: number
  ) => {
    const props = { bookId, title, order }
    const result = await (await sendApi("/book/addChapter", props)).data
    if (result.result) {
      return result.result
    } else {
      debug("Did not get right result?", { props })
      return false
    }
  }

  const updateChapter = async (
    chapter: Chapter
  ): Promise<boolean> => {
    throw NotImplemented

    // if (!bookDetail) return noBookDetail("saveChapter")
    // debug("saveChapter", { title: chapter.title })
    // const result = await (await sendApi("/chapter/upsert", chapter)).data
    // if (result.result) {
    //   return true
    // } else {
    //   debug("Did not get right result?")
    //   return false
    // }
  }

  const detail = async (bookId:string):Promise<BookDetail|null> => await (await getApi(`book/${bookId}`)).data

  return {
    follow,
    like,
    share,
    save,
    isAuthor,
    updateGenre,
    addGallery,
    sortChapters,
    addChapter,
    updateChapter,
    detail
  }
}

export default useBookApi