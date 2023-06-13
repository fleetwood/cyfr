import useDebug from "../../hooks/useDebug"
import { now, sortChapters } from "../../utils/helpers"
import { Chapter, ChapterDetail, ChapterDetailInclude, ChapterStub, ChapterStubInclude } from "../prismaContext"

const {debug, info, fileMethod} = useDebug('entities/prismaChapter')

const detail = async (id: string): Promise<ChapterDetail|null> => await prisma.chapter.findFirst({where:{id}, include: ChapterDetailInclude}) as unknown as ChapterDetail

const stub = async (id: string): Promise<ChapterStub|null> => await prisma.chapter.findFirst({where:{id}, include: ChapterStubInclude}) as unknown as ChapterStub

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
      const sum = await prisma.$queryRaw`SELECT f_book_wordCount(${chapter.bookId})`
      if (!sum) {
        info('upsert (book)', 'Unable to update the book count for some reason....')
      }
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
