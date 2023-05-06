import useDebug from "../../hooks/useDebug"
import { now } from "../../utils/helpers"
import {
  Book, Chapter, GalleryCreateProps, GalleryDetail, GalleryEngageProps, GalleryStub, GalleryStubInclude, GalleryUpsertProps, ImageUpsertProps, Like, Share
} from "../prismaContext"

const {debug, info, fileMethod} = useDebug('entities/prismaGallery')

export type GalleryAddImageProps = {
  id: string
  images: ImageUpsertProps[]
}

/**
 * Using `f_user_galleries` FNX
 * @param authorId :string
 * @returns `json`
 */
const userGalleries = async (authorId: string): Promise<any> => {
  debug('userGalleries', {authorId})
  try {
    const result = await prisma.$queryRaw`select * from f_user_galleries(${authorId})`
    if (result) {
      return result
    }
    throw {code: fileMethod, message: 'Could not find galleries for that user id'}
  } catch (error) {
    throw error
  }
}

const details = async () : Promise<GalleryDetail[]> => {
  debug("details")
  try {
    const result:any[] = await prisma.$queryRaw`SELECT * FROM v_gallery_detail`
    if (result) return result as GalleryDetail[]
    throw { code: fileMethod, message: "Unable to find a gallery by that key" }
  } catch (error) {
    info(`getDetail ERROR`, error)
    throw error
  }
}
const stubs = async () : Promise<GalleryStub[]> => {
  debug("details")
  try {
    const result:any[] = await prisma.$queryRaw`SELECT * FROM v_gallery_stub`
    if (result) return result as GalleryStub[]
    throw { code: fileMethod, message: "Unable to find a gallery by that key" }
  } catch (error) {
    info(`getDetail ERROR`, error)
    throw error
  }
}

/**
 * Using `f_gallery_detail` FNX
 * @param galleryId: string
 * @returns: {@link GalleryDetail}
 */
const detail = async (galleryId: string): Promise<GalleryDetail> => {
  debug("getDetail", { galleryId })
  try {
    const result:any[] = await prisma.$queryRaw`SELECT * FROM f_gallery_detail(${galleryId})`
    if (result[0]) return result[0] as GalleryDetail
    throw { code: fileMethod, message: "Unable to find a gallery by that key" }
  } catch (error) {
    info(`getDetail ERROR`, error)
    throw error
  }
}

/**
 * Using `v_gallery_stub` 
 * @param galleryId: string
 * @returns: {@link GalleryDetail}
 */
const stub = async (galleryId: string): Promise<GalleryStub> => {
  debug("getDetail", { galleryId })
  try {
    const result = await prisma.$queryRaw`SELECT * FROM v_gallery_stub WHERE "id" = ${galleryId}`
    if (result) return result as GalleryStub
    throw { code: fileMethod, message: "Unable to find a gallery by that key" }
  } catch (error) {
    info(`getDetail ERROR`, error)
    throw error
  }
}

/**
 * Params {@link GalleryEngageProps}
 * @param galleryId: String
 * @param authorId: String
 * @returns: {@link Like}
 */
const like = async ({
  galleryId,
  authorId,
}: GalleryEngageProps): Promise<Like> => {
  debug(`like`, { galleryId, authorId })
  throw { code: fileMethod, message: "Feature not implemented" }
}

/**
 * Using `prisma.share.create`
 * Params {@link GalleryEngageProps}
 * @param galleryId: String
 * @param authorId: String
 * @returns: {@link Share}
 */
const share = async ({
  galleryId,
  authorId,
}: GalleryEngageProps): Promise<Share> => {
  debug(`share`, { galleryId, authorId })
  const share = await prisma.share.create({
    data: {
      authorId,
      galleryId
    }
  })
  if (share) {
    return share
  }
  throw { code: fileMethod, message: "Feature not implemented" }
}

/**
 * Using `prisma.gallery.findMany`
 * @returns: {@link GalleryStub}
 */
const all = async (): Promise<GalleryStub[]> => {
  try {
    const g = await prisma.$queryRaw`select * from v_gallery_stub`
  if (g) return g as GalleryStub[]
    throw { code: fileMethod, message: "Unable to obtain all galleries!!!" }
  } catch (error) {
    throw error
  }
}

/**
 * 
 * @param props - {@link GalleryAddImageProps} 
 * @returns 
 */
const addImages = async ({ id, images }: GalleryAddImageProps) => {
  debug("addImage", { id, images })
  try {
    const result = await prisma.gallery.update({
      where: {
        id,
      },
      data: {
        images: {
          createMany: {
            data: [...images],
          },
        },
      },
    })
    if (result) return result
  } catch (error) {
    info(`addImage ERROR`, error)
  }
}

/**
 * For upserting title, and description. For {@link Image}, {@link addImages}, {@link Like}, {@link Share}, and 
 * relations such as {@link Book}.gallery, {@link Chapter}.gallery, etc, will be handled by the parent.
 * @param props:{@link GalleryUpsertProps}
 * @returns 
 */
const upsertGallery = async(props:GalleryUpsertProps) => {
  debug('upsertGallery', props)
  try {
    if (!props.galleryId) return createGallery(props)
    else {
      debug('upserting')
      const result = await prisma.gallery.update({
        where: {id:props.galleryId},
        data: {
          updatedAt: now(),
          title: props.title,
          description: props.description,
          authorId: props.authorId,
          images: {
            connectOrCreate: [
              props.images?.map(img => { return {
                id: img.id,
                authorId: img.authorId,
                url: img.url,
                visible: img.visible,
                height: img.height,
                width: img.width,
                title: img.title
              }}) as any
            ]
          }
        }
      })
      if (result) {
        return result
      }
      throw({code: fileMethod('upsert'), message: 'Failed upserting (update) gallery'})
    }
  } catch (error) {
    throw { code: fileMethod, message: "Unable to create gallery" }
  }
}

/**
 * 
 * @param authorId :String
 * @param title :String | null
 * @param description: String | null
 * @param images: {@link ImageUpsertProps}[] | null | undefined
 * @returns: {@link Gallery}
 */
const createGallery = async ({authorId,title,description,images,}: GalleryCreateProps) => {
  try {
    debug(`createGallery`, {authorId, title, description, images})
    const result = await prisma.gallery.create({
      data: {
        authorId,
        title,
        description,
        images: {
          connect: images?.map(img => {
            return {id: img.id}
          })
        }
      }
    })

    if (result) {
      return result
    }
    // throw { code: fileMethod, message: "Failed to create gallery" }
  } catch (error) {
    info(`createGallery ERROR`, error)
    throw(error)
  }
}

export const PrismaGallery = {
  addImages,
  createGallery,
  upsertGallery,
  details,
  detail,
  stubs,
  stub,
  like,
  share,
  all,
  userGalleries
}
