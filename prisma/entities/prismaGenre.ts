import useDebug from "../../hooks/useDebug"
import {
  BookStubInclude,
  Cover,
  CoverStubInclude,
  Gallery,
  Genre,
  GenreDeleteProps,
  GenreDetail,
  GenreFeed,
  GenreFeedInclude,
  GenreStub,
  GenreUpsertProps,
  UserStubSelect,
  prisma,
} from "../prismaContext"

const { debug, info, fileMethod } = useDebug("entities/prismaGenre")

const details = async (): Promise<Genre[]> => await prisma.genre.findMany()
const detail = async (id:string): Promise<Genre|null> => await prisma.genre.findUnique({where: {id}})

const stubs = async (): Promise<GenreStub[]> => await prisma.genre.findMany({
  include: {
    covers: true,
    books: {
      where: {
        active: true
      },
      include: {
        authors: {
          select: UserStubSelect
        },
        categories: true,
        cover: {
          include: {
            image: true,
          }
        },
        _count: {
          select: {
            chapters: true,
            follows: true,
            likes: true,
            shares: true
          }
        }
      },
    }
  },
}) as unknown as GenreStub[]
const stub = async (id:string): Promise<Genre|null> => await prisma.genre.findUnique({where: {id}})

const covers = async (byGenre?: string): Promise<Cover[] | null> => {
  try {
    const results: (Cover[]) | null =
      await prisma.cover.findMany({
        where: {
          active: true,
          genreId: byGenre
        },
        include: {
          book: {include: BookStubInclude},
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
  covers,
  upsertGenre,
  deleteGenre,
}
