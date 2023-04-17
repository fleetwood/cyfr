import useDebug from "../../hooks/useDebug"
import { GenericResponseError, ResponseError } from "../../types/response"
import { dedupe } from '../../utils/helpers'
import {
  Book,
  BookDeleteProps,
  BookDetail,
  BookDetailInclude,
  BookFollowProps,
  BookUpsertProps,
  Follow,
  Like,
  LikeProps,
  Share,
  ShareProps,
  prisma
} from "../prismaContext"

const { debug, info, todo, fileMethod } = useDebug("entities/prismaBook", 'DEBUG')

const detail = async (idOrTitleOrSlug:string) => {
  try {
    const result:any[] = await prisma.$queryRaw`SELECT * 
      FROM v_book_detail 
      WHERE id = ${idOrTitleOrSlug}
        OR LOWER(title) = LOWER(${idOrTitleOrSlug})
        OR LOWER(slug) = LOWER(${idOrTitleOrSlug})
      `
    if (result.length>0) {
      return result[0] as BookDetail
    }
    throw { code: fileMethod("details"), message: "No book was returned!" }
  } catch (error) {
    info('details FAIL', error)
    throw(error)
  }
}

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
        const {id, title, slug, hook, synopsis, back, status, active, prospect, words} = props
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
        const result = id 
          ? prisma.book.update({
            where: {id}, 
            data, 
            include: BookDetailInclude
          })
          : prisma.book.create({data, include: BookDetailInclude})
        if (result) {
          return result as unknown as BookDetail
        }
        throw({code: fileMethod('createBook'), message: 'Not yet implemented'})
    } catch (error) {
        info('createBook', {error})
        throw(error)
    }
}

const follow = async (props:BookFollowProps): Promise<Follow> => {
  // TODO cannot follow your own stuff
  const {followerId, bookId, isFan} = props;
  try {
    // we have to do this crazy little dance because composites in Follow model
    const exists = await prisma.follow.findFirst({
      where: {
        followerId,
        bookId
      }
    })
    const data = {followerId,bookId,isFan}
    const include = {follower: true,following: true}
    debug('follow', {followerId, bookId, data})

    const follow = exists 
      ? await prisma.follow.update({
        where: {id: exists.id},
        data,
        include
      })
      : await prisma.follow.create({
        data,
        include
      })
    if (!follow) {
      throw({code: fileMethod('follow'), message: 'Unable to follow book'})
    }
    return follow;
  } catch (error) {
    debug(`follow ERROR`, {
      ...{ props },
      ...{ error },
    });
    throw GenericResponseError(error as unknown as ResponseError);
  }
}

const like = async (props:LikeProps): Promise<Like> => {
  // TODO cannot like your own stuff
  const {authorId, bookId} = props;
  try {
    // we have to do this crazy little dance because composites in Follow model
    const exists = await prisma.like.findFirst({
      where: {
        authorId: authorId.toString(),
        bookId: authorId.toString()
      }
    })
    const data = {
      authorId: authorId.toString(),
      bookId: authorId.toString()
    }
    debug('like', {authorId, bookId, data})

    const like = exists 
      ? await prisma.like.update({
        where: {id: exists.id},
        data
      })
      : await prisma.like.create({
        data: {
          author: {
            connect: {
              id: authorId.toString()
            }
          },
          book: {
            connect: {
              id: bookId!.toString()
            }
          }
        }
      })
    if (!like) {
      throw({code: fileMethod('like'), message: 'Unable to like book'})
    }
    return like;
  } catch (error) {
    debug(`like ERROR`, {
      ...{ props },
      ...{ error },
    });
    throw GenericResponseError(error as unknown as ResponseError);
  }
}

const share = async (props:ShareProps): Promise<Share> => {
  // TODO cannot share more than once
  const {authorId, bookId} = props;
  try {
    // we have to do this crazy little dance because composites in Follow model
    const exists = await prisma.share.findFirst({
      where: {
        authorId: authorId.toString(),
        bookId: authorId.toString()
      }
    })
    const data = {
      authorId: authorId.toString(),
      bookId: authorId.toString(),
      // Yo, this might handle unshare!!!
      visible: exists ? !exists.visible : true
    }

    debug('Share', {authorId, bookId, data})

    const share = exists 
      ? await prisma.share.update({
        where: {id: exists.id},
        data
      })
      : await prisma.share.create({
        data: {
          author: {
            connect: {
              id: authorId.toString()
            }
          },
          book: {
            connect: {
              id: bookId!.toString()
            }
          }
        }
      })
    if (!share) {
      throw({code: fileMethod('Share'), message: 'Unable to share book'})
    }
    return share;
  } catch (error) {
    debug(`share ERROR`, {
      ...{ props },
      ...{ error },
    });
    throw GenericResponseError(error as unknown as ResponseError);
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

export const PrismaBook = { detail, byId, byUser, upsert, follow, like, share, deleteBook }
