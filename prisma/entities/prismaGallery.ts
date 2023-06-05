import useDebug from "hooks/useDebug"
import {
  Book, Chapter, Gallery, GalleryCreateProps,
  GalleryDetail,
  GalleryDetailInclude, GalleryEngageProps,
  GalleryUpsertProps, ImageUpsertProps, Like, Share
} from "prisma/prismaContext"
import { now } from "utils/helpers"

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
const userGalleries = async (authorId: string): Promise<Gallery[]> => await prisma.gallery.findMany({where: {authorId}})

const details = async () : Promise<GalleryDetail[]> => await prisma.gallery.findMany({include: GalleryDetailInclude})
const detail = async (id: string): Promise<GalleryDetail|null> => await prisma.gallery.findUnique({where: {id}, include: GalleryDetailInclude})

const stubs = async () : Promise<Gallery[]> => await prisma.gallery.findMany()
const stub = async (id: string): Promise<Gallery|null> => await prisma.gallery.findUnique({where: {id}})

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
  try {
    const like = await prisma.like.create({
      data: {
        galleryId,
        authorId
      }
    })
    if (like) return like
    throw {code: fileMethod('like'), message: 'Unable to create like'}
  } catch (error) {
    throw error
  }
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
  userGalleries
}
