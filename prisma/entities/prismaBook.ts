import useDebug from "hooks/useDebug"
import { GenericResponseError, ResponseError } from "types/response"
import { dedupe, now, toSlug } from 'utils/helpers'
import {
  AuthorStub,
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
  LikeProps,
  Post,
  PrismaChapter,
  UserStub,
  prisma
} from "prisma/prismaContext"
import { NotImplemented } from "utils/api"

const { debug, info, fileMethod } = useDebug("entities/prismaBook", 'DEBUG')

type BookQueryProps = {
  id?:    string
  name?:  string
  email?: string
  slug?:  string
}
const detail = async (props:BookQueryProps):Promise<BookDetail> => await prisma.book.findUnique({ where: { ...props }, ...BookDetailInclude}) as unknown as BookDetail

const details = async ():Promise<BookDetail[]> => await prisma.book.findMany({...BookDetailInclude}) as unknown as BookDetail[]

const stub = async (props:BookQueryProps):Promise<BookStub> => await prisma.book.findUnique({ where: { ...props }, ...BookStubInclude}) as unknown as BookStub

const stubs = async ():Promise<BookStub[]> => await prisma.book.findMany({...BookStubInclude}) as unknown as BookStub[]

const create = async (props:BookCreateProps) => {
  try {
    throw NotImplemented('prismaBook/create')
    const results = await prisma.book.create({
      /*
data: {
    title: "Testing book",
    slug: "testing-book",
    genre: {
      connect: {id:"clgbb9l5j0004nn0gsd78ilvj"}
    },
    owner: {
      connect: {id:"clkj5n6zv0000bu8potlrns5z"}
    },
    cover: {
      connect: { id: 'clkkp3ax4000gmp0h0tp7j9hv'}
    },
    back: "There is nothing on the back",
    authors: {
      connectOrCreate:[
        {
          where: {id: 'cll33207f0004qv0hpys0lvoo'},
          create: {userId: 'clkj5n6zv0000bu8potlrns5z'},
        },
        {
          where: {id: 'cll33207f0006qv0h1u6givyh'},
          create: {userId: 'clkk4hf7m0008buwta5k9iynu'},
        },
      ]
    },
    permission: {
      create: {
        agent: ['READ', 'COMMENT', 'SHARE'],
        artist: ['READ', 'COMMENT', 'SHARE'],
        author: ['READ', 'COMMENT', 'SHARE', 'FEEDBACK'],
        editor: ['READ', 'COMMENT', 'SHARE', 'FEEDBACK'],
        fan: ['READ', 'COMMENT', 'SHARE', 'FEEDBACK'],
        stan: ['READ', 'COMMENT', 'SHARE', 'FEEDBACK'],
        follower: ['READ', 'COMMENT', 'SHARE'],
        following: ['READ', 'COMMENT', 'SHARE'],
        friend: ['READ', 'COMMENT', 'SHARE'],
        public: ['NONE'],
        member: ['READ', 'COMMENT', 'SHARE'],
      }
    },
    status: 'DRAFT'
  }
      */
      data: {
        owner: { connect: {id: props.ownerId}},
        title: props.title,
        slug: toSlug(props.title),
        words: 0,
        fiction: props.fiction,
        visible: props.visible,
        prospect: props.prospect,
        back: props.back,
        hook: props.hook,
        synopsis: props.synopsis,
        permission: { create: props.permission },
        genre: { connect: { id: props.genreId } },
        cover: { connect: { id: props.coverId } },
        authors: { connect: props.authors },
      },
    })
  } catch (error) {
    throw error
  }
}

const upsert = async (props:BookUpsertProps): Promise<Book> => {
    try {
        const {ownerId, id, title, slug, genreId, hook, synopsis, back, status, visible, fiction, prospect, words, completeAt, authors} = props
        const authorConnect = dedupe(
          (authors ?? [])
            .filter((a) => a !== null)
            .map((a) => {
              return { id: a.id }
            }),
          'id'
        )

        const data =  {
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
            connect: dedupe((authors??[]).filter(a => a !== null).map(a => { return {id: a.id}}),'id')
          },
          genre: {
            connect: {
              id: genreId
            }
          },
          owner: {
            connect: {
              id: ownerId
            }
          }
        }
        debug('upsert PROPS', {id, title, slug, status, visible, words, completeAt})
        //TODO 1. if a cover hasn't been uploaded, obtain the default for the genre
        //TODO 2. categories, oy
        const result = id 
          ? await prisma.book.update({
            where: {id},
            data
          })
          : await prisma.book.create({data})
        if (result) {
          const book  = result as unknown as Book
          debug('upsert SUCCESS', {
            result,
            props
          })
          return book
        }
        throw({code: fileMethod('createBook'), message: 'Unsuccessful'})
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
  const {creatorId, bookId} = props;
  if (!bookId || !creatorId) throw({code: 'prismaBook/like', message: 'Missing params'})
  try {
    // we have to do this crazy little dance because composites in Follow model
    const exists = await prisma.like.findFirst({
      where: {
        creatorId: creatorId.toString(),
        bookId: bookId.toString()
      }
    })
    const data = {
      creatorId: creatorId.toString(),
      bookId: bookId.toString()
    }
    debug('like', {creatorId, bookId, data})

    const like = exists 
      ? await prisma.like.update({
        where: {id: exists.id},
        data
      })
      : await prisma.like.create({
        data: {
          creator: {
            connect: {
              id: creatorId.toString()
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

const share = async (props:{creatorId:String, bookId:String}): Promise<Post> => {
  // TODO cannot share more than once
  const {creatorId, bookId} = props;
  if (!bookId || !creatorId) throw({code: 'prismaBook/share', message: 'Missing params'})

  try {
    // we have to do this crazy little dance because composites in Follow model
    // const exists = await prisma.share.findFirst({
    //   where: {
    //     creatorId: creatorId.toString(),
    //     bookId: bookId.toString()
    //   }
    // })
    // const data = {
    //   creatorId: creatorId.toString(),
    //   bookId: bookId.toString(),
    //   visible: exists ? !exists.visible : true
    // }

    debug('Share', {creatorId, bookId})
    throw NotImplemented('prismaBook/share')
    // const share = exists 
    //   ? await prisma.post.update({
    //     where: {id: exists.id},
    //     data
    //   })
    //   : await prisma.share.create({
    //     data: {
    //       creator: {
    //         connect: {
    //           id: creatorId.toString()
    //         }
    //       },
    //       book: {
    //         connect: {
    //           id: bookId!.toString()
    //         }
    //       }
    //     }
    //   })
    // if (!share) {
    //   throw({code: fileMethod('Share'), message: 'Unable to share book'})
    // }
    // return share;
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
            ...BookStubInclude
        })
        return result as unknown as BookStub

    } else if (book && newImage) {
      debug('Creating a new cover from an existing image', {cover})
        const {height, width, creatorId, id: imageId} = newImage!
        const result = await prisma.book.update({
            where: { id: book.id},
            data: { cover: {
                create: {
                    creatorId, imageId
                }
            }},
            ...BookStubInclude
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
            ...BookStubInclude
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

const deleteBook = async ({bookId,creatorId}:BookEngageProps): Promise<Book | undefined> => {
  try {
    debug("deleteBook", { bookId, creatorId })
    // TODO "Make sure author deleting the book is an owner.
    throw { code: fileMethod("deleteBook"), message: "Not implemented" }
  } catch (error) {
    info("deleteBook ERROR: ", error)
    throw { code: fileMethod("deleteBook"), message: "Book was not deleted!" }
  }
}

const isTitleUnique = async (title:string):Promise<Boolean> => await prisma.book.findFirst({where: {title: {equals: title, mode: 'insensitive'}}}) === null

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
  , upsert
  , updateWordCount
  , follow
  , isTitleUnique
  , like
  , share
  , addChapter
  , addGallery
  , sortChapters
  , changeCover
  , changeGenre
  , deleteBook 
}
