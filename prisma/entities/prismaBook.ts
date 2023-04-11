import ReactHtmlParser from 'react-html-parser'
import {
  Book,
  BookUpsertProps,
  BookDeleteProps,
  BookDetail,
  BookDetailInclude,
} from "../prismaContext"
import useDebug from "../../hooks/useDebug"
import { dedupe } from '../../utils/helpers'

const { debug, info, todo, fileMethod } = useDebug("entities/prismaBook", 'DEBUG')

const byId = async (id: string): Promise<BookDetail | null> => {
  try {
    return (await prisma.book.findFirst({
      where: {
        id: id,
        active: true,
      },
      include: BookDetailInclude,
    })) as unknown as BookDetail
  } catch (error) {
    throw { code: fileMethod("byId"), message: "No book was returned!" }
  }
}

const byUser = async (id: string): Promise<BookDetail[]> => {
  try {
    const books = await prisma.book.findMany({
      where: {
        authors: {
          some: {
            id,
          },
        },
        active: true,
      },
      include: BookDetailInclude,
    })
    if (books) {
      return books as unknown as BookDetail[]
    }
    throw {
      code: fileMethod("byUser"),
      message: `Failed to find books for ${id}`,
    }
  } catch (error) {
    info(fileMethod("byUser"), { id, error })
    return []
  }
}

const upsert = async (props:BookUpsertProps): Promise<BookDetail|null> => {
    try {
        const {title, slug, hook, synopsis, back, status, active, prospect, words} = props
        const data =  {
          title,
          slug: encodeURIComponent(slug || title.replaceAll(' ','-')).toLowerCase(),
          hook,
          synopsis,
          back,
          status,
          active,
          prospect,
          words,
          authors: {
            connect: dedupe(props.authors.map(a => { return {id: a.id}}),'id')
          },
          genre: {
            connect: {
              id: props.genreId
            }
          }
        }

        debug('createBook', data)
        todo('createBook',`
            2. if a cover hasn't been uploaded, obtain the default for the genre
            4. categories, oy
        `)
        const result = prisma.book.create({data, include: BookDetailInclude})
        if (result) {
          return result as unknown as BookDetail
        }
        throw({code: fileMethod('createBook'), message: 'Not yet implemented'})
    } catch (error) {
        info('createBook', {error})
        throw(error)
    }
}

const deleteBook = async ({bookId,authorId,}: BookDeleteProps): Promise<Book | undefined> => {
  try {
    debug("deleteBook", { bookId, authorId })
    todo("deleteBook", "Make sure author deleting the book is an owner.")
    throw { code: fileMethod("deleteBook"), message: "Not implemented" }
  } catch (error) {
    info("deleteBook ERROR: ", error)
    throw { code: fileMethod("deleteBook"), message: "Book was not deleted!" }
  }
}

export const PrismaBook = { byId, byUser, upsert, deleteBook }
