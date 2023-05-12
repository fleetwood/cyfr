import useDebug from "../../hooks/useDebug"
import {
  Gallery,
  Genre,
  GenreDeleteProps,
  GenreDetail,
  GenreFeed,
  GenreFeedInclude,
  GenreStub,
  GenreUpsertProps,
  prisma,
} from "../prismaContext"

const { debug, info, fileMethod } = useDebug("entities/prismaGenre")

const details = async (): Promise<GenreDetail[]> => {
  try {
    debug("details")
    return (await prisma.$queryRaw`
      SELECT * 
      FROM v_genre_detail
    `) as GenreDetail[]
  } catch (error) {
    info("details", { error })
    throw { code: fileMethod("byId"), message: "No genre was returned!" }
  }
}

const detail = async (idOrSlugOrName: string): Promise<GenreDetail> => {
  try {
    debug("detail", idOrSlugOrName)
    return (await prisma.$queryRaw`
      SELECT * 
      FROM v_genre_detail detail
      WHERE detail.id = ${idOrSlugOrName}
      OR    LOWER(detail.name) = LOWER(${idOrSlugOrName})
      OR    LOWER(detail.slug) = LOWER(${idOrSlugOrName})
    `) as GenreDetail
  } catch (error) {
    info("detail", { error })
    throw { code: fileMethod("byId"), message: "No genre was returned!" }
  }
}

const stubs = async (): Promise<GenreStub[]> => {
  try {
    debug("stubs")
    return (await prisma.$queryRaw`
      SELECT * 
      FROM v_genre_stub
    `) as GenreStub[]
  } catch (error) {
    info("stubs", { error })
    throw { code: fileMethod("byId"), message: "No genre was returned!" }
  }
}

const stub = async (idOrSlugOrName: string): Promise<GenreDetail> => {
  try {
    debug("stub", idOrSlugOrName)
    return (await prisma.$queryRaw`
      SELECT * 
      FROM v_genre_stub
      WHERE detail.id = ${idOrSlugOrName}
      OR    LOWER(detail.name) = LOWER(${idOrSlugOrName})
      OR    LOWER(detail.slug) = LOWER(${idOrSlugOrName})
    `) as GenreStub
  } catch (error) {
    info("stub", { error })
    throw { code: fileMethod("byId"), message: "No genre was returned!" }
  }
}

const gallery = async (byGenre?: string): Promise<Gallery | null> => {
  try {
    const results: (Genre & { gallery: Gallery | null }) | null =
      await prisma.genre.findFirst({
        include: {
          gallery: true,
        },
      })
    if (results) {
      return results.gallery
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
  detail,
  details,
  stub,
  stubs,
  gallery,
  upsertGenre,
  deleteGenre,
}
