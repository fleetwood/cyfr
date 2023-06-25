import { NotImplemented } from "utils/api"
import useDebug from "../../hooks/useDebug"
import { Cover, CoverDeleteProps, CoverDetail, CoverStub, CoverUpsertProps, Like } from "../prismaContext"
const {debug, info, todo, fileMethod} = useDebug('entities/prismaImage')

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

const remove = async ({coverId, authorId}: CoverDeleteProps): Promise<Cover> => {
  try {
    todo('deleteImage','Need to make sure the user in session matches the user making the request')
    debug("deleteImage", {coverId, authorId})
    return await prisma.cover.update({ 
      where: {
        id: coverId,
      },
      data: {
        active: false
      }
    })
  } catch (error) {
    debug("deleteImage ERROR: ", error)
    throw { code: "images/create", message: "Image was not created!" }
  }
}

const like = async (props: any): Promise<Like> => {throw NotImplemented}

const share = async (props: any): Promise<Cover> => {throw NotImplemented}

export const PrismaCover = { detail, details, stub, stubs, upsert, remove, like, share }
