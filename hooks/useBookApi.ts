import { Dispatch, SetStateAction, useState } from "react"
import { BookDetail, BookStatus, Image, Chapter, Character, CyfrUser, Genre, GenreListItem, PrismaBook, BookCategory } from "../prisma/prismaContext"
import { getApi, sendApi } from "../utils/api"
import useBookDetail from "./useBookDetail"
import useDebug from "./useDebug"
import { KeyVal } from "../types/props"
import {BookApi, BookApiProps, BookApiRelations, BookApiUpdate} from './../types/bookApi.def'
import { sortChapters } from "../utils/helpers"

const {debug, info, err} = useDebug('hooks/useBookApi','DEBUG')

/**
 * 
 * @param bookDetail: {@link BookDetail}
 * @param genres?:    {@link GenreListItem}
 * @param cyfrUser?:  {@link CyfrUser} 
 * @returns 
 */
const useBookApi = (props:BookApiProps):BookApi => {
  debug('useBookApi')
  const {bookDetail, setBookDetail, isLoading, error, invalidate} = useBookDetail(props.bookDetail.id)
  const [genres, setGenres] = useState<GenreListItem[]>(props.genres||[])

  const genresToOptions:KeyVal[] = genres.map(g => { return { key: g.title, value: g.id }})

  const notEmpty = (arr: Array<any> | undefined | null) => arr !== undefined && arr !== null && arr.length > 0

  const cleanArray = <T>(arr:Array<T>|undefined):Array<T> => (arr ?? []).filter(a => a!== undefined && a !== null) as Array<T>

  const chapters = cleanArray<Chapter>(bookDetail?.chapters).sort((a,b) => a.order > b.order ? 1 : -1) as Chapter[]
  const characters = cleanArray<Character>(bookDetail?.characters) as Character[]
  const categories = cleanArray<BookCategory>(bookDetail?.categories) as BookCategory[]

  const noBookDetail = (method:string) => {
    debug(method, 'bookDetail is null')
    return false
  }

  const by = (bookDetail?.authors??[]).flatMap(author => author.name).join(' and ')
  //todo: This should be handled by a commune...
  const isAuthor = (bookDetail?.authors??[]).filter(a => a.id === props.cyfrUser?.id).length > 0
  
  const follow = async (followerId:string, isFan=false) => {
    if (!bookDetail) return noBookDetail('follow')
    const upsert = await (await sendApi("book/follow", {
        bookId: bookDetail.id,
        followerId,
        isFan
    })).data
    if (upsert.result) {
      invalidate()
      return true
    }
    else {
        debug('Did not get right result?', upsert.result)
        return false
    }
  }

  const like = async (userId:string) => {
    if (!bookDetail) return noBookDetail('like')
    const upsert = await (await sendApi("book/like", {
        bookId: bookDetail.id,
        authorId: userId
    })).data
    if (upsert.result) {
      invalidate()
      return true
    }
    else {
        debug('Did not get right result?', upsert.result)
        return false
    }
  }

  /**
   * Be careful with this, as we are using {@link PrismaBook.upsert} for the save operation,
   * so props like {@link BookDetail.title} cannot be *null*. Also, cannot use this for 
   * {connectOrCreate} 
   * @param title: {string|null}
   * @param startedAt: {string|null} - NOTE: This is in date format *YYYY-MM-DD hh:mm:ss.sss*
   * @param completedAt: {string|null} - NOTE: This is in date format *YYYY-MM-DD hh:mm:ss.sss*
   * @param active: {boolean}
   * @param prospect: {boolean}
   * @param fiction: {boolean}
   * @param status: {@link BookStatus}
   * @param genreId: {string|null}
   * @param back: {string|null}
   * @param synopsis: {string|null}
   * @param hook: {string|null}
   */
  const update = async (props:BookApiUpdate) => {
    if (!bookDetail) return noBookDetail('update')
    debug('update',{fiction: bookDetail.fiction, prospect: bookDetail.prospect, active: bookDetail.active,props})
    const newBook:BookDetail = {
      ...bookDetail,
      ...props,
      genreId: props.genreId??bookDetail.genreId,
      title: props.title??bookDetail.title
    }
    setBookDetail(newBook)
  }

  const share = async (userId:string) => {
    if (!bookDetail) return noBookDetail('share')
    const upsert = await (await sendApi("book/share", {
        bookId: bookDetail.id,
        authorId: userId
    })).data
    if (upsert.result) {
      invalidate()
      return true
    }
    else {
        debug('Did not get right result?', upsert.result)
        return false
    }
  }

  const saveRelations = async (relation:BookApiRelations) => {
    if (!bookDetail) return noBookDetail('saveRelations')
    const props = relation === 'Chapter' ? bookDetail?.chapters :
                  relation === 'Character' ? bookDetail?.characters :
                  relation === 'Gallery' ? bookDetail?.gallery :
                  undefined
    const api = `${relation.toLowerCase()}/upsert`
    if (!props) {
      info('Unable to determine save relations',{relation,props})
      return false
    }
    debug('saveRelations', {relation, props})
    const upsert = await (await sendApi(api, props)).data
    if (upsert.result) {
      debug('result', {...upsert.result})
      invalidate()
      return true
    }
    else {
      debug('Did not get right result?', upsert)
      return false
    }
  }
  
  const save = async () => {
    if (!bookDetail) return noBookDetail('save')
    debug('save',{fiction: bookDetail.fiction, prospect: bookDetail.prospect, active: bookDetail.active})
    const upsert = await (await sendApi("book/upsert", bookDetail)).data
    if (upsert.result) {
      const b = upsert.result
      debug('result', {fiction: b.fiction, prospect: b.prospect, active: b.active})
      invalidate()
      return true
    }
    else {
      debug('Did not get right result?', upsert)
      return false
    }
  }

  const sortChapters = async (changedChapter:Chapter):Promise<Boolean> => {
    debug('sortChapters', chapters)
    if (!bookDetail) return noBookDetail('sortChapters')
    const result = await sendApi('/chapter/sort',{currentChapters:chapters, changedChapter})
    if (result) {
      invalidate()
      return true
    }
    debug('sortChapters FAIL')
    return false
  }

  const addChapter = async (title:string, order:number) => {
    if (!bookDetail) return noBookDetail('addChapter')
    const props = {bookId: bookDetail.id, title, order}
    const result = await (await sendApi('/book/addChapter', props)).data
    if (result.result) {
      invalidate()
      return result.result
    } else {
      debug('Did not get right result?', {props})
      return false
    }
  }

  const saveChapter = async (chapter:Chapter):Promise<boolean> => {
    if (!bookDetail) return noBookDetail('saveChapter')
    debug('saveChapter', {title: chapter.title})
    const result = await (await sendApi('/chapter/upsert', chapter)).data
    if (result.result) {
      invalidate()
      return true
    } else {
      debug('Did not get right result?', {props})
      return false
    }
  }

  return {
    by,
    bookDetail,
    categories,
    chapters,
    characters,
    error, 
    genres,
    isAuthor,
    isLoading, 
    addChapter,
    cleanArray,
    follow,
    genresToOptions,
    invalidate,
    like,
    notEmpty,
    share,
    save,
    setBookDetail,
    saveChapter,
    sortChapters,
    update,
  } as BookApi
}

export default useBookApi