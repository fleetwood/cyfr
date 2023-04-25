import { Chapter, ChapterDetail, ChapterStub, PrismaBook, Share, ShareDeleteProps, ShareFeed } from "../prismaContext"
import useDebug from "../../hooks/useDebug"
import { now, sortChapters } from "../../utils/helpers"

const {debug, info, fileMethod} = useDebug('entities/prismaChapter', 'DEBUG')

const detail = async (id: string): Promise<ChapterDetail | null> => {
  debug('detail', id)
  try {
    return await prisma.chapter.findUnique({where: {id}}) as ChapterDetail
    throw { code: fileMethod('detail'), message: `Error finding chapter for ${id}!`}
  } catch (error) {
    debug('detail ERROR', error)
    throw error
  }
}

const stub = async (id: string): Promise<ChapterStub | null> => {
  debug('stub', id)
  try {
    return await prisma.chapter.findUnique({where: {id}}) as ChapterStub
    throw { code: fileMethod('detail'), message: `Error finding chapter for ${id}!`}
  } catch (error) {
    debug('stub ERROR', error)
    throw error
  }
}

const upsert = async (chapter:Chapter) => {
  debug('upsert', chapter)
  try {
    const create = {
      title: chapter.title,
      order: chapter.order,
      words: chapter.words,
      bookId: chapter.bookId
    }
    const update = {
      ...create,
      id: chapter.id,
      content: chapter.content,
      active: chapter.active,
      galleryId: chapter.galleryId
    }
    const upsert = {
      where: { id: chapter.id},
      create,
      update
    }
    debug('upsert data', upsert)
    const result = await prisma.chapter.upsert({...upsert})

    if (result) {
      debug('upsert', result)
      // const sum = await prisma.$queryRaw`SELECT sum(words) FROM "Chapter" where "bookId" = ${chapter.bookId}`||0
      // const book = await prisma.book.update({where: {id: chapter.bookId}, data:{ words: sum}})
      // if (!book) {
      //   info('upsert (book)', 'Unable to update the book count for some reason....')
      // }
      return result
    }
    throw {code: fileMethod('upsert'), message :'Did not obtain an upsert result'}
  } catch (error) {
    debug('upsert ERROR', error)
    throw error
  }
}

/**
 * @see {@link sortChapters}
 */
const sort = async (currentChapters:Chapter[]|null|undefined, changedChapter:Chapter) => {
  try {
    debug('sort', {changedChapter, currentChapters})
    let results:Chapter[] = []
    const sortedChapters = (await sortChapters(currentChapters,changedChapter)).forEach(async chapter => {
      const r = await prisma.chapter.update({
        where: {id: chapter.id},
        data: {
          order: chapter.order,
          updatedAt: now()
        }}
      )
      if (r) results.push(r)
    })

    if (results) {
      debug('sortChapters',{results})
      return results
    }
    
  } catch (error) {
    
  }
}

export const PrismaChapter = { detail, stub, sort, upsert }
