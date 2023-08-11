import useDebug from "hooks/useDebug"
import {
  Book, Chapter, Gallery, GalleryCreateProps,
  GalleryDetail,
  GalleryDetailInclude, GalleryEngageProps,
  GalleryStub,
  GalleriesStubInclude,
  GalleryUpsertProps, ImageUpsertProps, Like, Post
} from "prisma/prismaContext"
import { NotImplemented } from "utils/api"
import { now } from "utils/helpers"

const {debug, info, fileMethod} = useDebug('entities/prismaGallery')

export type GalleryAddImageProps = {
  id: string
  images: ImageUpsertProps[]
}

/**
 * Using `f_user_galleries` FNX
 * @param creatorId :string
 * @returns `json`
 */
const userGalleries = async (creatorId: string): Promise<GalleryStub[]> => await prisma.gallery.findMany({
  where: {
    creatorId,
    visible: true
  },
  include: {
    creator: true,
    images: {
      include: {
      _count: {
        select: {
          likes: true,
          shares: true
        }
      }}
    },
    _count: {
      select: {
        likes: true,
        shares: true
      }
    }
  }
}) as unknown as GalleryStub[]

const details = async () : Promise<GalleryDetail[]> => await prisma.gallery.findMany(GalleryDetailInclude) as GalleryDetail[]
const detail = async (id: string): Promise<GalleryDetail> => await prisma.gallery.findUnique({where: {id}, ...GalleryDetailInclude})as GalleryDetail

const stubs = async () : Promise<Gallery[]> => await prisma.gallery.findMany()
const stub = async (id: string): Promise<Gallery|null> => await prisma.gallery.findUnique({where: {id}})

/**
 * Params {@link GalleryEngageProps}
 * @param galleryId: String
 * @param creatorId: String
 * @returns: {@link Like}
 */
const like = async ({
  galleryId,
  creatorId,
}: GalleryEngageProps): Promise<Like> => {
  try {
    return await prisma.like.create({
      data: {
        galleryId,
        creatorId
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Using `prisma.share.create`
 * Params {@link GalleryEngageProps}
 * @param galleryId: String
 * @param creatorId: String
 * @returns: {@link Share}
 */
const share = async ({galleryId,creatorId,}: GalleryEngageProps): Promise<Post> => {
  debug(`share`, { galleryId, creatorId })
  try {
    throw NotImplemented('prismaGallery/share')
    // return await prisma.post.create({
    //   data: {
    //     creatorId,
    //     galleryId
    // }})    
  } catch (error) { 
    throw { code: fileMethod, message: "Feature not implemented" }
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
          creatorId: props.creatorId,
          images: {
            connectOrCreate: [
              props.images?.map(img => { return {
                id: img.id,
                creatorId: img.creatorId,
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
 * @param creatorId :String
 * @param title :String | null
 * @param description: String | null
 * @param images: {@link ImageUpsertProps}[] | null | undefined
 * @returns: {@link Gallery}
 */
const createGallery = async ({creatorId,title,description,images,}: GalleryCreateProps) => {
  try {
    debug(`createGallery`, {creatorId, title, description, images})
    const result = await prisma.gallery.create({
      data: {
        creatorId,
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
