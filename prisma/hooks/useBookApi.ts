import { Book, BookDetail, BookEngageProps, BookFollowProps, BookStub, BookStubInclude, BookUpsertProps, ChangeCoverProps, ChangeGenreProps, Chapter } from "prisma/prismaContext"
import { NotImplemented, getApi, sendApi } from "utils/api"
import { isAuthor } from 'utils/helpers/book'
import useDebug from "hooks/useDebug"

const { debug, fileMethod } = useDebug("hooks/useBookApi", 'DEBUG')

debug("BookApi")

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

const slugDetail = async (bookSlug:string):Promise<BookDetail|null> => await (await getApi(`book/slug/${bookSlug}`)).data

const detail = async (bookId:string):Promise<BookDetail|null> => await (await getApi(`book/${bookId}`)).data

const follow = async (props:BookFollowProps):Promise<boolean> => await (await sendApi("book/follow", props)).data

const like = async (props: BookEngageProps):Promise<boolean>  => await (await sendApi("book/like", props)).data

const noBookDetail = (method: string) => {
    debug(method, "bookDetail is null")
    return false
}

const save = async (detail?:BookDetail) => {
    if (!detail) return noBookDetail("save")
    const {back, synopsis, visible, prospect, fiction, title, slug, words, completeAt} = detail
    debug("save", {back, synopsis, visible, prospect, fiction, title, slug, words, completeAt})
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

const share = async (props: BookEngageProps):Promise<boolean> => await (await sendApi("book/share", props)).data

const sortChapters = async (changedChapter: Chapter): Promise<Boolean> => {
    throw NotImplemented(fileMethod('sortChapters'))
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

const updateChapter = async (chapter: Chapter): Promise<boolean> => {
    throw NotImplemented(fileMethod('updateChapter'))
}

const updateGenre = async (props:ChangeGenreProps):Promise<boolean> => await (await sendApi('book/changeGenre', props)).data

const changeCover = async (props:ChangeCoverProps): Promise<BookStub> => await (await sendApi("book/changeCover", props)).data

const upsert = async (props:BookUpsertProps):Promise<Boolean> => await (await sendApi('book/upsert', {props})).data

export const useBookApi = {
  addChapter
  , addGallery
  , detail
  , slugDetail
  , follow
  , like
  , save
  , share
  , sortChapters
  , updateChapter
  , updateGenre
  , upsert
  , changeCover
}
