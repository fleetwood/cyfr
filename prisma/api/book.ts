import useDebug from "../../hooks/useDebug"
import { sendApi } from "../../utils/api"
import { BookDetail, BookDetailApi, Chapter, CyfrUser } from "../prismaContext"

const { debug, info, err } = useDebug("prisma/api/book", "DEBUG")

debug("BookApi")

const noBookDetail = (method: string) => {
  debug(method, "bookDetail is null")
  return false
}

const NotImplemented = {code: 500, message: 'Not implemented'}

export const isAuthor = (bookDetail:BookDetail, cyfrUser?:CyfrUser) => cyfrUser ? (bookDetail?.authors??[]).filter(a => a.id === cyfrUser?.id).length > 0 : false

const BookApi = ():BookDetailApi => {
  const follow = async (
    bookId: string, 
    followerId: string,
    isFan = false
  ) => {
    const upsert = await (
      await sendApi("book/follow", {
        bookId,
        followerId,
        isFan,
      })
    ).data
    if (upsert.result) {
      return true
    } else {
      debug("Did not get right result?", upsert.result)
      return false
    }
  }

  const like = async (bookId:string, userId: string) => {
    const upsert = await (
      await sendApi("book/like", {
        bookId,
        authorId: userId,
      })
    ).data
    if (upsert.result) {
      return true
    } else {
      debug("Did not get right result?", upsert.result)
      return false
    }
  }

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

  const share = async (bookId:string, userId: string) => {
    const upsert = await (
      await sendApi("book/share", {
        bookId: bookId,
        authorId: userId,
      })
    ).data
    if (upsert.result) {
      return true
    } else {
      debug("Did not get right result?", upsert.result)
      return false
    }
  }

  // const saveRelations = async (
  //   bookDetail: BookDetail,
  //   relation: BookApiRelations
  // ) => {
  //   if (!bookDetail) return noBookDetail("saveRelations")
  //   const props =
  //     relation === "Chapter"
  //       ? bookDetail?.chapters
  //       : relation === "Character"
  //       ? bookDetail?.characters
  //       : relation === "Gallery"
  //       ? bookDetail?.gallery
  //       : undefined
  //   const api = `${relation.toLowerCase()}/upsert`
  //   if (!props) {
  //     info("Unable to determine save relations", { relation, props })
  //     return false
  //   }
  //   debug("saveRelations", { relation, props })
  //   const upsert = await (await sendApi(api, props)).data
  //   if (upsert.result) {
  //     debug("result", { ...upsert.result })
  //     return true
  //   } else {
  //     debug("Did not get right result?", upsert)
  //     return false
  //   }
  // }

  const save = async (detail?:BookDetail) => {
    if (!detail) return noBookDetail("save")
    const {back, synopsis, active, prospect, fiction, title, slug, words} = detail
    debug("save", {back, synopsis, active, prospect, fiction, title, slug, words})
    const upsert = await (await sendApi("book/upsert", detail)).data
    if (upsert.result) {
      const b = upsert.result
      debug("result", {
        fiction: b.fiction,
        prospect: b.prospect,
        active: b.active,
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
    throw NotImplemented
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
    updateChapter
  }
}

export default BookApi