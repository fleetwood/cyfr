import useDebug from 'hooks/useDebug'
import {
  Book,
  BookCreateProps,
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
  PrismaChapter,
  PrismaShare,
  Share,
  prisma
} from 'prisma/prismaContext'
import {GenericResponseError,ResponseError} from 'types/response'
import {dedupe,now,toSlug} from 'utils/helpers'
import {PrismaLike} from './prismaLike'

const { debug, info, fileMethod } = useDebug('entities/prismaBook')

const detail = async (slug: string): Promise<any> => {
  debug('detail', {slug})
  try {
    const result = (await prisma.book.findUnique({
      where: { slug },
      ...BookDetailInclude,
    }))
    if (result) {
      return result
    }
    throw { code: 'prismaBook.detail', message: 'No result' }
  } catch (error) {
    debug('detail FAIL', error)
    throw error
  }
}

const details = async (): Promise<BookDetail[]> =>
  (await prisma.book.findMany({
    ...BookDetailInclude,
  })) as unknown as BookDetail[]

const stub = async (slug: string): Promise<BookStub> =>
  (await prisma.book.findUnique({
    where: { slug },
    ...BookStubInclude,
  })) as unknown as BookStub

const stubs = async (): Promise<BookStub[]> =>
  (await prisma.book.findMany({ ...BookStubInclude })) as unknown as BookStub[]

const create = async (props: BookCreateProps) => {
  try {
    const data = {
      owner: { connect: { id: props.ownerId } },
      title: props.title,
      visible: props.visible,
      slug: toSlug(props.title),
      words: 0,
      status: props.status ?? 'DRAFT',
      fiction: props.fiction,
      prospect: props.prospect,
      back: props.back,
      hook: props.hook,
      synopsis: props.synopsis,
      permission: { create: props.permission },
      genre: { connect: { id: props.genreId } },
      cover: { connect: { id: props.coverId } },
      authors: {
        connect: props.authors.map((a) => {
          return { id: a.id }
        }),
      },
    }
    debug('create', data)
    const results = await prisma.book.create({ data })
    if (results) {
      return results
    }
    throw { code: 'prismaBook.create', message: 'No results on create' }
  } catch (error) {
    throw error
  }
}

const upsert = async (props: BookUpsertProps): Promise<Book> => {
  try {
    const {
      ownerId,
      id,
      title,
      slug,
      genreId,
      hook,
      synopsis,
      back,
      status,
      visible,
      fiction,
      prospect,
      words,
      completeAt,
      authors,
    } = props
    const authorConnect = dedupe(
      (authors ?? [])
        .filter((a) => a !== null)
        .map((a) => {
          return { id: a.id }
        }),
      'id'
    )

    const data = {
      title,
      slug: toSlug(slug ?? title),
      back,
      hook,
      synopsis,
      status,
      visible,
      prospect,
      fiction,
      words,
      completeAt,
      updatedAt: now(),
      authors: {
        connect: dedupe(
          (authors ?? [])
            .filter((a) => a !== null)
            .map((a) => {
              return { id: a.id }
            }),
          'id'
        ),
      },
      genre: {
        connect: {
          id: genreId,
        },
      },
      owner: {
        connect: {
          id: ownerId,
        },
      },
    }
    debug('upsert PROPS', {
      id,
      title,
      slug,
      status,
      visible,
      words,
      completeAt,
    })
    //TODO 1. if a cover hasn't been uploaded, obtain the default for the genre
    //TODO 2. categories, oy
    const result = id
      ? await prisma.book.update({
          where: { id },
          data,
        })
      : await prisma.book.create({ data })
    if (result) {
      const book = result as unknown as Book
      debug('upsert SUCCESS', {
        result,
        props,
      })
      return book
    }
    throw { code: fileMethod('createBook'), message: 'Unsuccessful' }
  } catch (error) {
    info('upsert ERROR', { error })
    throw error
  }
}

const follow = async (props: BookFollowProps): Promise<Follow> => {
  // TODO cannot follow your own stuff
  const { followerId, bookId, isFan } = props
  debug('follow', props)
  try {
    // we have to do this crazy little dance because composites in Follow model
    const exists = await prisma.follow.findFirst({
      where: {
        followerId,
        bookId,
      },
    })
    const data = { followerId, bookId, isFan }
    const include = { follower: true, following: true }
    debug('follow', { followerId, bookId, data })

    const follow = exists
      ? await prisma.follow.update({
          where: { id: exists.id },
          data,
          include,
        })
      : await prisma.follow.create({
          data,
          include,
        })
    if (!follow) {
      throw { code: fileMethod('follow'), message: 'Unable to follow book' }
    }
    return follow
  } catch (error) {
    debug(`follow ERROR`, {
      ...{ props },
      ...{ error },
    })
    throw GenericResponseError(error as unknown as ResponseError)
  }
}

/**
 * Method references {@link PrismaLike.likeBook}
 * @param bookId: String
 * @param creatorId: String
 * @returns: {@link Like}
 */
const like = async (props: {bookId:string, creatorId:string}): Promise<Like> => PrismaLike.likeBook(props)

/**
 * Method references {@link PrismaShare.shareBook}
 * @param bookId: String
 * @param creatorId: String
 * @returns: {@link Like}
 */
const share = async (props:{bookId:string, creatorId:string}):Promise<Share> => PrismaShare.shareBook(props)

const addChapter = async (props: {
  bookId: string
  title: string
  order: number
}): Promise<Book> => {
  try {
    const { bookId, title, order } = props
    const update = {
      where: {
        id: bookId,
      },
      data: {
        chapters: {
          create: {
            title,
            order,
          },
        },
      },
    }
    debug('addChapter', { bookId, update })
    return await prisma.book.update(update)
  } catch (error) {
    debug(`addChapter ERROR`, {
      ...{ props },
      ...{ error },
    })
    throw GenericResponseError(error as unknown as ResponseError)
  }
}

const addGallery = async (props: {
  bookId: string
  galleryId: string
}): Promise<Book> => {
  try {
    const { galleryId, bookId } = props
    const update = {
      where: {
        id: bookId,
      },
      data: {
        gallery: {
          connect: {
            id: galleryId,
          },
        },
      },
    }
    debug('addGallery', { bookId, update })
    return await prisma.book.update(update)
  } catch (error) {
    debug(`addGallery ERROR`, {
      ...{ props },
      ...{ error },
    })
    throw GenericResponseError(error as unknown as ResponseError)
  }
}

const changeGenre = async (props: {
  bookId: string
  genreId: string
}): Promise<boolean> => {
  const result = await prisma.book.update({
    where: { id: props.bookId },
    data: {
      genre: { connect: { id: props.genreId } },
    },
  })
  if (result) return true
  return false
}

const changeCover = async (props: ChangeCoverProps): Promise<BookStub> => {
  try {
    const { book, cover, newImage, imageId } = props
    debug('changeCover', { book, cover, newImage })
    if (book && cover) {
      debug('Connecting to an existing cover', { cover })
      const result = await prisma.book.update({
        where: { id: book.id },
        data: { cover: { connect: { id: cover!.id } } },
        ...BookStubInclude,
      })
      return result as unknown as BookStub
    } else if (book && newImage) {
      debug('Creating a new cover from an existing image', { cover })
      const { height, width, creatorId, id: imageId } = newImage!
      const result = await prisma.book.update({
        where: { id: book.id },
        data: {
          cover: {
            create: {
              creatorId,
              imageId,
            },
          },
        },
        ...BookStubInclude,
      })
      return result as unknown as BookStub
    } else if (book && imageId) {
      debug('Connecting to an existing cover from its image id', { imageId })
      const cover = await prisma.cover.findFirst({
        where: { image: { id: imageId } },
      })
      if (cover) {
        const result = await prisma.book.update({
          where: { id: book.id },
          data: {
            cover: {
              connect: {
                id: cover.id,
              },
            },
          },
          ...BookStubInclude,
        })
        return result as unknown as BookStub
      }
    }
    throw { code: 'prismaBook.changeCover', message: 'That dint work' }
  } catch (e) {
    throw e
  }
}

/**
 * This is a redirect to {@link PrismaChapter.sort}
 * @returns
 */
const sortChapters = async (
  currentChapers: Chapter[],
  changedChapter: Chapter
) => PrismaChapter.sort(currentChapers, changedChapter)

const deleteBook = async ({
  bookId,
  creatorId,
}: BookEngageProps): Promise<Book | undefined> => {
  try {
    debug('deleteBook', { bookId, creatorId })
    // TODO "Make sure author deleting the book is an owner.
    throw { code: fileMethod('deleteBook'), message: 'Not implemented' }
  } catch (error) {
    info('deleteBook ERROR: ', error)
    throw { code: fileMethod('deleteBook'), message: 'Book was not deleted!' }
  }
}

const isTitleUnique = async (title: string): Promise<Boolean> =>
  (await prisma.book.findFirst({
    where: { title: { equals: title, mode: 'insensitive' } },
  })) === null

const updateWordCount = async (bookId: string): Promise<Boolean> => {
  try {
    const book = await prisma.book.findFirstOrThrow({
      where: { id: bookId },
      include: {
        chapters: true,
      },
    })
    const words = await prisma.book.update({
      where: { id: bookId },
      data: {
        words: book.chapters.reduce((p: number, c: Chapter) => {
          return p + c.words
        }, 0),
      },
    })
    if (words) {
      return true
    }
    throw { code: 'updateWordCount Fail', message: 'Update Word Count fail' }
  } catch (error) {
    throw error
  }
}

export const PrismaBook = {
  create,
  detail,
  details,
  stub,
  stubs,
  upsert,
  updateWordCount,
  follow,
  isTitleUnique,
  like,
  share,
  addChapter,
  addGallery,
  sortChapters,
  changeCover,
  changeGenre,
  deleteBook,
}
