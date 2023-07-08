import useDebug from "../../hooks/useDebug"
import {
  Cover,
  Genre,
  GenreAddCoverProps,
  GenreDeleteProps,
  GenreFeed,
  GenreStub,
  GenreStubInclude,
  GenreUpsertProps,
  prisma
} from "../prismaContext"

const { debug, info, fileMethod } = useDebug("entities/prismaGenre")

const details = async (): Promise<Genre[]> => await prisma.genre.findMany()
const detail = async (id:string): Promise<Genre|null> => await prisma.genre.findUnique({where: {id}})

const stubs = async (): Promise<GenreStub[]> => await prisma.genre.findMany({...GenreStubInclude}) as GenreStub[]
const stub = async (id:string): Promise<GenreStub|null> => await prisma.genre.findUnique({where: {id}, ...GenreStubInclude}) as GenreStub

const covers = async (byGenre?: string): Promise<Cover[] | null> => {
  try {
    const results = await prisma.cover.findMany({
      where: {
        visible: true,
        genreId: byGenre
      },
      include: {
        image: true
      },
    })
    if (results) {
      return results
    }
    throw {
      code: fileMethod("covers"),
      message: `Unable to obtain genre covers (${byGenre})`,
    }
  } catch (error) {
    debug("covers", { error, byGenre })
    return null
  }
}

const upsertGenre = async (props: GenreUpsertProps): Promise<GenreFeed> => {
  const method = "upsertGenre"
  try {
    const { title, description } = props
    const slug = title.replace(" ", "-").toLowerCase().trim()
    debug(method, { title, description })

    return (await prisma.genre.upsert({
      where: {
        title,
      },
      update: {
        title,
        description,
        slug,
      },
      create: {
        title,
        description,
        slug,
      },
      select: {
        title: true,
        description: true,
        slug: true,
      },
    })) as unknown as GenreFeed
  } catch (error) {
    info(method, error)
    throw { code: fileMethod(method), message: "Genre was not created!" }
  }
}

/**
 * 
 * @param id (String) Genre id
 * @param image (Image) Image to add
 * @returns Promise<GenreStub>
 */
const addCover = async (props:GenreAddCoverProps):Promise<GenreStub> => {
  try {
    const cover = await prisma.cover.create({
      data: {
        visible: true,
        imageId: props.image.id,
        creatorId: props.image.creatorId,
        genreId: props.id
      }
    })
    if (!cover) {
      throw ({code: 'genre/addCover', message: 'Failed creating cover'})
    }
    const result = await prisma.genre.update({
      where: { id: props.id},
      data: { covers: {connect: {id: cover!.id}}},
      ...GenreStubInclude
    })
    if (result) {
      return result as unknown as GenreStub
    }
    throw ({code: 'genre/addCover', message: 'Failed connecting cover'})
  } catch (error) {
    throw error
  }
}

const deleteGenre = async ({
  id,
  title,
}: GenreDeleteProps): Promise<Genre | null> => {
  const method = "deleteGenre"
  try {
    debug(method, { id, title })
    const where = id ? { id } : title ? { title } : undefined
    return id
      ? await prisma.genre.delete({ where: { id } })
      : title
      ? await prisma.genre.delete({ where: { title } })
      : null
  } catch (error) {
    info(fileMethod(method), error)
    throw { code: fileMethod(method), message: "Share was not deleted!" }
  }
}

export const PrismaGenre = {
  addCover,
  detail,
  details,
  stub,
  stubs,
  covers,
  upsertGenre,
  deleteGenre,
}
