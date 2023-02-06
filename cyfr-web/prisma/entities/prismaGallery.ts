import { log } from "../../utils/log"

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
export { addImages, createGallery }
