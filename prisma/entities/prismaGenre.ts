import useDebug from "../../hooks/useDebug"
import { Genre, GenreDeleteProps, GenreFeed, GenreFeedInclude, GenreListItem, GenreUpsertProps, prisma } from "../prismaContext"

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

const all = async (): Promise<GenreListItem[]> => {
  try {
    const result =  await prisma.$queryRaw`select * FROM f_genre_all()`
    if (result) {
      return result as GenreListItem[]
    }
    throw({code: fileMethod('all'), message: 'No results returned'})
  } catch (error) {
    throw { code: fileMethod("all"), message: "No genres were returned!" }
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

export const PrismaGenre = { all, byId, byTitle, covers, upsertGenre, deleteGenre, insertDefaults }
