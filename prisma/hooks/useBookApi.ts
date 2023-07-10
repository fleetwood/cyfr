import useDebug from "hooks/useDebug"
import useRocketQuery from "hooks/useRocketQuery"
import { BookDetail, BookEngageProps, BookFollowProps, BookStub, BookUpsertProps, ChangeCoverProps, ChangeGenreProps, Chapter } from "prisma/prismaContext"
import { NotImplemented, getApi, sendApi } from "utils/api"

const { debug, fileMethod } = useDebug("hooks/useBookApi", 'DEBUG')
const noBookDetail = (method: string) => {debug(method, "bookDetail is null");return false}


type UseBookQueryProps = {
    bookId?:    string
    bookSlug?:  string
}
const query = ({bookId, bookSlug}:UseBookQueryProps) => useRocketQuery<BookDetail>({
    name: [`bookDetail-${bookId||bookSlug}`, { type: 'book'}],
    url: bookSlug ? `/book/slug/${bookSlug}` : `/book/${bookId}`
})

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

/**
 * Get {@link BookDetail} using the book id
 * @param {string} bookId 
 * @returns BookDetail
 */
const detail = async (bookId:string):Promise<BookDetail> => await (await getApi(`book/${bookId}`)).data

/**
 * Get {@link BookDetail} using the book slug
 * @param {string} bookSlug 
 * @returns BookDetail
 */
const slugDetail = async (bookSlug:string):Promise<BookDetail> => await (await getApi(`book/slug/${bookSlug}`)).data

const follow = async (props:BookFollowProps):Promise<boolean> => await (await sendApi("book/follow", props)).data

const like = async (props: BookEngageProps):Promise<boolean>  => await (await sendApi("book/like", props)).data

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

const updateChapter = async (chapter: Chapter): Promise<boolean> => {throw NotImplemented(fileMethod('updateChapter'))}

const updateGenre = async (props:ChangeGenreProps):Promise<boolean> => await (await sendApi('book/changeGenre', props)).data

const changeCover = async (props:ChangeCoverProps): Promise<BookStub> => await (await sendApi("book/changeCover", props)).data

const upsert = async (props:BookUpsertProps):Promise<Boolean> => await (await sendApi('book/upsert', {props})).data

type BookApi = {
    query: ({ bookId, bookSlug }: UseBookQueryProps) => {
        data: any;
        isLoading: boolean;
        error: unknown;
        invalidate: () => void;
    }
    addChapter: (bookId: string, title: string, order: number) => Promise<any>
    addGallery: (bookId: string, galleryId?: string) => Promise<any>
    detail: (bookId: string) => Promise<BookDetail>
    slugDetail: (bookSlug: string) => Promise<BookDetail>
    follow: (props: BookFollowProps) => Promise<boolean>
    like: (props: BookEngageProps) => Promise<boolean>
    save: (detail?: BookDetail) => Promise<boolean>
    share: (props: BookEngageProps) => Promise<boolean>
    sortChapters: (changedChapter: Chapter) => Promise<Boolean>
    updateChapter: (chapter: Chapter) => Promise<boolean>
    updateGenre: (props: ChangeGenreProps) => Promise<boolean>
    changeCover: (props: ChangeCoverProps) => Promise<BookStub>
    upsert: (props: BookUpsertProps) => Promise<Boolean>
  }

  const useBookApi = ():BookApi => {
    return {
        query
        , addChapter
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
        , changeCover
        , upsert
  }}

  export default useBookApi