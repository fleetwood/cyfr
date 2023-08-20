import useDebug from 'hooks/useDebug'
import {
  Cover,
  CoverDeleteProps,
  CoverDetail,
  CoverStub,
  CoverStubInclude,
  CoverUpsertProps,
  Like,
  PrismaLike,
  PrismaShare,
  Share,
} from 'prisma/prismaContext'
const { debug, info, fileMethod } = useDebug('entities/prismaCover', 'DEBUG')

const detail = async (id: string): Promise<CoverDetail | null> =>
  (await prisma.cover.findUnique({ where: { id } })) as unknown as CoverDetail
const details = async (): Promise<CoverDetail[]> =>
  (await prisma.cover.findMany()) as unknown as CoverDetail[]

const stub = async (id: string): Promise<CoverStub | null> =>
  (await prisma.cover.findUnique({
    where: { id },
    include: CoverStubInclude.include,
  })) as unknown as CoverStub
const stubs = async (): Promise<CoverStub[]> =>
  (await prisma.cover.findMany({
    include: CoverStubInclude.include,
  })) as unknown as CoverStub[]

const upsert = async (props: CoverUpsertProps): Promise<CoverStub> => {
  debug('upsert', props)
  try {
    return (props.id
      ? await prisma.cover.update({
          where: { id: props.id },
          data: { ...props },
          include: CoverStubInclude.include,
        })
      : await prisma.cover.create({
          data: { ...props },
          include: CoverStubInclude.include,
        })) as unknown as CoverStub
  } catch (error) {
    info('upsert ERROR: ', {
      error,
      id: props.id !== undefined,
      props,
      include: CoverStubInclude.include,
    })
    throw error
  }
}

const remove = async ({
  coverId,
  creatorId,
}: CoverDeleteProps): Promise<Cover> => {
  try {
    //TODO: Need to make sure the user in session matches the user making the request
    debug('remove', { coverId, creatorId })
    return await prisma.cover.update({
      where: {
        id: coverId,
      },
      data: {
        visible: false,
      },
    })
  } catch (error) {
    debug('remove ERROR: ', error)
    throw { code: 'cover/remove', message: 'Cover was not removed!' }
  }
}

/**
 * Method references {@link PrismaLike.likeCover}
 * @param coverId: String
 * @param creatorId: String
 * @returns: {@link Like}
 */
const like = async (props: {
  coverId: string
  creatorId: string
}): Promise<Like> => PrismaLike.likeCover(props)

/**
 * Method references {@link PrismaShare.shareCover}
 * @param coverId: String
 * @param creatorId: String
 * @returns: {@link Like}
 */
const share = async (props: {
  coverId: string
  creatorId: string
}): Promise<Share> => PrismaShare.shareCover(props)

const findCover = async (genre?: string): Promise<CoverStub[]> => {
  const result = prisma.genre.findMany({
    where: genre ? { title: genre } : {},
    select: { covers: { include: { image: true } } },
  })
  if (result)
    return (await result).flatMap((g) => g.covers) as unknown as CoverStub[]
  throw { code: 'prismaCover.findCover', message: 'No covers' }
}

export const PrismaCover = {
  detail,
  details,
  findCover,
  stub,
  stubs,
  upsert,
  remove,
  like,
  share,
}
