import { NotImplemented } from "utils/api"
import useDebug from "hooks/useDebug"
import { Cover, CoverDeleteProps, CoverDetail, CoverStub, CoverUpsertProps, Like } from "prisma/prismaContext"
const {debug, info, fileMethod} = useDebug('entities/prismaCover')

const detail = async (id: string): Promise<CoverDetail | null> => await prisma.cover.findUnique({where: {id}}) as unknown as CoverDetail
const details = async (): Promise<CoverDetail[]> => await prisma.cover.findMany() as unknown as CoverDetail[]

const stub = async (id: string): Promise<CoverStub | null> => await prisma.cover.findUnique({where: {id}}) as unknown as CoverStub
const stubs = async (): Promise<CoverStub[]> => await prisma.cover.findMany() as unknown as CoverStub[]

const upsert = async (props: CoverUpsertProps): Promise<Cover> => {
  debug('upsert', props)
  const {id} = props
  try {
    return await prisma.cover.upsert({ 
      where: { id },
      create: {...props},
      update: {...props}
    })
  } catch (error) {
    info("upsert ERROR: ", error)
    throw error
  }
}

const remove = async ({coverId, creatorId}: CoverDeleteProps): Promise<Cover> => {
  try {
    //TODO: Need to make sure the user in session matches the user making the request
    debug("remove", {coverId, creatorId})
    return await prisma.cover.update({ 
      where: {
        id: coverId,
      },
      data: {
        visible: false
      }
    })
  } catch (error) {
    debug("remove ERROR: ", error)
    throw { code: "cover/remove", message: "Cover was not removed!" }
  }
}

const like = async (props: any): Promise<Like> => {throw NotImplemented}

const findCover = async (genre?:string): Promise<CoverStub[]> => {
  const result = prisma.genre.findMany({
    where: genre ? { title: genre } : { },
    select: { covers: {include: {image: true}}}
  })
  if (result) return (await result).flatMap(g => g.covers) as unknown as CoverStub[]
  throw ({code: 'prismaCover.findCover', message: 'No covers'})
}

export const PrismaCover = { detail, details, findCover, stub, stubs, upsert, remove, like }
