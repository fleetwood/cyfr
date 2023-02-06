import { log } from "../../utils/log"
import { GalleryDetail } from "../types"
import { GalleryDetailInclude } from "../types/gallery.def"

const fileName = "prismaGallery"
const fileMethod = (method: string) => `${fileName}.${method}`
const trace = (method: string, t?: any) =>
  log(fileMethod(method) + t ? " " + JSON.stringify(t, null, 2) : "")

export type GalleryAddImageProps = {
  id: string
  images: [{
    url: string
    authorId: string
    }]
}

const getDetail = async (galleryId:string):Promise<GalleryDetail> => {
  trace('getDetail', {galleryId})
  try {
    const result= await prisma.gallery.findUnique({
      where: {id: galleryId},
      include: GalleryDetailInclude
    })
    if (result)
      return result as unknown as GalleryDetail
    throw {code: fileMethod, message: 'Unable to find a gallery by that key'}
  } catch (error) {
    trace(`getDetail ERROR`, error)
    throw(error)
  }
}

const addImages = async ({id, ...props}:GalleryAddImageProps) => {
  trace("addImage", { id, ...props })
  try {
    const result = await prisma.gallery.update({
      where: {
        id,
      },
      data: {
        images: {
          createMany: {
            data: [...props.images]
          },
        },
      },
    })
    if (result) return result
  } catch (error) {
    trace(`\taddImage ERROR`, error)
  }
}

type CreateGalleryProps = {
  authorId: string
  title?: string
  description?: string
}

const createGallery = async ({authorId,title,description}: CreateGalleryProps) => {
  try {
    const result = await prisma.gallery.create({
      data: {authorId,title,description,}
    })
    if (result) return result
    throw { code: fileMethod, message: "Unable to create gallery" }
  } catch (error) {
    trace(`\tcreateGallery ERROR`, error)
  }
}
export const PrismaGallery = { addImages, createGallery, getDetail }
