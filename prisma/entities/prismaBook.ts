import useDebug from "../../hooks/useDebug"
import { GenericResponseError, ResponseError } from "../../types/response"
import { dedupe, now } from '../../utils/helpers'
import {
  Book,
  BookDetail,
  BookDetailInclude,
  BookEngageProps,
  BookFollowProps,
  BookStub,
  BookStubInclude,
  BookUpsertProps,
  ChangeCoverProps,
  Chapter,
  Follow,
  Like,
  LikeProps,
  PrismaChapter,
  Share,
  ShareProps,
  prisma
} from "../prismaContext"

const { debug, info, todo, fileMethod } = useDebug("entities/prismaBook")

type BookQueryProps = {
  id?:    string
  name?:  string
  email?: string
  slug?:  string
}
const detail = async (props:BookQueryProps):Promise<Book|null> => await prisma.book.findUnique({ where: { ...props }, include: BookDetailInclude})

const details = async ():Promise<Book[]> => await prisma.book.findMany()

const stub = async (props:BookQueryProps):Promise<Book|null> => await prisma.book.findUnique({ where: { ...props }})

const stubs = async ():Promise<Book[]> => await prisma.book.findMany()

const byUser = async (id: string): Promise<BookDetail[]> => {
  try {
    const books = await prisma.$queryRaw`
      SELECT * FROM v_book_detail
      WHERE id IN (
          SELECT "A"
          FROM _user_books
          WHERE "B" = ${id}
      )`
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
        const {id, title, slug, hook, synopsis, back, status, active, fiction, prospect, words, completeAt} = props
        const data =  {
          title,
          slug: encodeURIComponent((slug || title).replaceAll(' ','-')).toLowerCase(),
          hook,
          synopsis,
          back,
          status,
          active,
          prospect,
          fiction,
          words,
          completeAt,
          updatedAt: now(),
          authors: {
            connect: dedupe((props.authors??[]).filter(a => a !== null).map(a => { return {id: a.id}}),'id')
          },
          genre: {
            connect: {
              id: props.genreId
            }
          }
        }
        debug('upsert PROPS', {id, title, slug, status, active, words, completeAt})
        todo('upsert',`
            1. if a cover hasn't been uploaded, obtain the default for the genre
            2. categories, oy
        `)
        const result = id 
          ? await prisma.book.update({
            where: {id},
            data
          })
          : await prisma.book.create({data})
        if (result) {
          const book  = result as unknown as BookDetail
          debug('upsert SUCCESS', {
            result,
            id: book.id, 
            title: book.title, 
            slug: book.slug, 
            status: book.status, 
            active: book.active, 
            words: book.words, 
            completeAt: book.completeAt,
            updatedAt: book.updatedAt
          })
          return book
        }
        throw({code: fileMethod('createBook'), message: 'Not yet implemented'})
    } catch (error) {
        info('upsert ERROR', {error})
        throw(error)
    }
}

const follow = async (props:BookFollowProps): Promise<Follow> => {
  // TODO cannot follow your own stuff
  const {followerId, bookId, isFan} = props;
  debug('follow', props)
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

const addChapter = async(props:{bookId:string, title:string, order: number}):Promise<Book> => {
  try {
    const {bookId, title, order} = props
    const update = {
      where: {
        id: bookId
      },
      data: {
        chapters: {
          create: {
            title,
            order
          }
        }
      }
    }
    debug('addChapter',{bookId, update})
    return await prisma.book.update(update)
  } catch (error) {
    debug(`addChapter ERROR`, {
      ...{ props },
      ...{ error },
    });
    throw GenericResponseError(error as unknown as ResponseError);
  }
}

const addGallery = async(props:{bookId:string, galleryId:string}):Promise<Book> => {
  try {
    const {galleryId, bookId} = props
    const update = {
      where: {
        id: bookId
      },
      data: {
        gallery: {
          connect: {
            id: galleryId
          }
        }
      }
    }
    debug('addGallery',{bookId, update})
    return await prisma.book.update(update)
  } catch (error) {
    debug(`addGallery ERROR`, {
      ...{ props },
      ...{ error },
    });
    throw GenericResponseError(error as unknown as ResponseError);
  }
}

const changeGenre = async (props: {bookId: string, genreId: string}):Promise<boolean> => {
  const result = await prisma.book.update({
    where: {id: props.bookId}, 
    data: {
      genre: { connect: { id: props.genreId}}
    }
  })
  if (result) return true
  return false
}

const changeCover = async (props:ChangeCoverProps):Promise<BookStub> => {
  try {
    const {book, cover, newImage, imageId} = props
    debug('changeCover', {book,cover,newImage})
    if (book && cover) {
      debug('Connecting to an existing cover', {cover})
        const result = await prisma.book.update({
            where: { id: book.id},
            data: { cover: {connect: {id: cover!.id}}},
            include: BookStubInclude
        })
        return result as unknown as BookStub

    } else if (book && newImage) {
      debug('Creating a new cover from an existing image', {cover})
        const {height, width, authorId, id: imageId} = newImage!
        const result = await prisma.book.update({
            where: { id: book.id},
            data: { cover: {
                create: {
                    authorId, imageId
                }
            }},
            include: BookStubInclude
        })
        return result as unknown as BookStub
    } else if (book && imageId) {
      debug('Connecting to an existing cover from its image id', {imageId})
      const cover = await prisma.cover.findFirst({
        where: { image: { id: imageId}}
      })
      if (cover) {
        const result = await prisma.book.update({
            where: { id: book.id},
            data: { 
              cover: {
                connect: {
                    id: cover.id,
                }
            }},
            include: BookStubInclude
        })
        return result as unknown as BookStub
      }
    }
    throw {code: 'prismaBook.changeCover', message: 'That dint work'}
  } catch (e) {
      throw e
  }
}

/**
 * This is a redirect to {@link PrismaChapter.sort}
 * @returns 
 */
const sortChapters = async (currentChapers:Chapter[], changedChapter:Chapter) => PrismaChapter.sort(currentChapers,changedChapter)

const deleteBook = async ({bookId,authorId}:BookEngageProps): Promise<Book | undefined> => {
  try {
    debug("deleteBook", { bookId, authorId })
    todo("deleteBook", "Make sure author deleting the book is an owner.")
    throw { code: fileMethod("deleteBook"), message: "Not implemented" }
  } catch (error) {
    info("deleteBook ERROR: ", error)
    throw { code: fileMethod("deleteBook"), message: "Book was not deleted!" }
  }
}

const updateWordCount = async (bookId:string):Promise<Boolean> => {
  try {
    const book = await prisma.book.findFirstOrThrow({
      where: {id: bookId},
      include: {
        chapters: true
      }
    })
    const words = await prisma.book.update({
      where: {id: bookId},
      data: {
        words: book.chapters.reduce((p:number, c:Chapter) => { return p + c.words }, 0)
      }
    })
    if (words) {
      return true
    }
    throw ({code: 'updateWordCount Fail', message: 'Update Word Count fail'})  
  } catch (error) {
    throw error
  }
}

export const PrismaBook = { 
    detail
  , details
  , stub
  , stubs
  , byUser
  , upsert
  , updateWordCount
  , follow
  , like
  , share
  , addChapter
  , addGallery
  , sortChapters
  , changeCover
  , changeGenre
  , deleteBook 
}
