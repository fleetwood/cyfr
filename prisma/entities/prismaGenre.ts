import { Genre, GenreDeleteProps, GenreFeed, GenreFeedInclude, GenreList, GenreUpsertProps, Share, ShareDeleteProps, ShareFeed } from "../prismaContext"
import useDebug from "../../hooks/useDebug"

const {debug, info, fileMethod} = useDebug('entities/prismaGenre')

const insertDefaults = async():Promise<any> => {
  // const genres = require('./../db.bak/genre.json')
  return prisma.genre.createMany({data: []})
}

const byId = async (id: string): Promise<GenreFeed|null> => {
  try {
    return await prisma.genre.findUnique({
      where: { id },
      include: GenreFeedInclude,
    }) as unknown as GenreFeed || null
  } catch (error) {
    throw { code: fileMethod('byId'), message: "No genre was returned!" }
  }
}

const byTitle = async (title:string):Promise<Genre[]> => {
  try {
    debug('byTitle', title)
    return await prisma.genre.findMany({
      where: { title: { equals: title, mode: 'insensitive'} },
      include: GenreFeedInclude,
    })
  } catch (error) {
    info('byTitle', {error})
    throw { code: fileMethod('byId'), message: "No genre was returned!" }
  }
}

/**
 * This is a hella heavy query and should be avoided! 
 * Use list() if possible instead
 * @returns GenreFeed[]
 */
const all = async (): Promise<GenreFeed[]> => {
  try {
    return await prisma.genre.findMany({
      include: GenreFeedInclude,
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
    }) as unknown as GenreFeed[]
  } catch (error) {
    throw { code: fileMethod("all"), message: "No genres were returned!" }
  }
}

const list = async (): Promise<GenreList[]> => {
  try {
    return await prisma.genre.findMany({
      include: {
        books: true
      },
      orderBy: {
        title: 'asc'
      }
    }) as unknown as GenreList[]
  } catch (error) {
    throw { code: fileMethod('list'), message: 'Weird, unable to get a list of genres...'}
  }
}

const covers = async(byGenre?:string): Promise<any> => {
  try {
    const results = prisma.genre.findMany({
      select: {
        title: true,
        id: true,
        covers: {
          select: {
            url: true
          }
        }
      }
    })
    if (results) {
      return results
    }
    throw({ code: fileMethod('covers'), message: `Unable to obtain genre covers (${byGenre})`})
  } catch (error) {
    debug('covers', {error, byGenre})
    return null
  }
}

const upsertGenre = async (props: GenreUpsertProps): Promise<GenreFeed> => {
  const method = "upsertGenre"
  try {
    const {title, description, fiction} = props
    debug(method, {title, description})
    
    return await prisma.genre.upsert({ 
      where: {
        title
      },
      update: {
        title,
        description,
        fiction
      },
      create: {
        title,
        description,
        fiction
      },
      select: {
        title: true,
        description: true,
        fiction: true
      }
    }) as unknown as GenreFeed
  } catch (error) {
    info(method, error)
    throw { code: fileMethod(method), message: "Genre was not created!" }
  }
}

const deleteGenre = async ({id, title}: GenreDeleteProps): Promise<Genre|null> => {
  const method = "deleteGenre"
  try {
    debug(method, {id, title})
    const where = id ? {id} : title ? {title} : undefined
    return id ? await prisma.genre.delete({where: {id}})
      : title ? await prisma.genre.delete({where : {title}})
      : null
  } catch (error) {
    info(fileMethod(method), error)
    throw { code: fileMethod(method), message: "Share was not deleted!" }
  }
}

export const PrismaGenre = { all, list, byId, byTitle, covers, upsertGenre, deleteGenre, insertDefaults }
