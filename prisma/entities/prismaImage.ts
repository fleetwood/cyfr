import { Image, Like, ImageDetail,ImageFeed, ImageDeleteProps, ImageEngageProps, ImageDetailInclude, ImageFeedInclude, ImageUpsertProps, ImageStub } from "../prismaContext"
import useDebug from "../../hooks/useDebug"
const {debug, info, todo, fileMethod} = useDebug('entities/prismaImage')

const detail = async (id: string): Promise<Image | null> => await prisma.image.findUnique({where: {id}})
const details = async (): Promise<Image[]> => await prisma.image.findMany()

const stub = async (id: string): Promise<Image | null> => await prisma.image.findUnique({where: {id}})
const stubs = async (): Promise<Image[]> => await prisma.image.findMany()

const upsert = async (props: ImageUpsertProps): Promise<Image> => {
  debug('upsert', props)
  const {url} = props
  try {
    return await prisma.image.upsert({ 
        where: { url },
        create: {...props},
        update: {...props}
      })
  } catch (error) {
    info("upsert ERROR: ", error)
    throw error
  }
}

const deleteImage = async ({imageId, creatorId}: ImageDeleteProps): Promise<Image> => {
  try {
    todo('deleteImage','Need to make sure the user in session matches the user making the request')
    debug("deleteImage", {imageId, creatorId})
    return await prisma.image.update({ 
      where: {
        id: imageId,
      },
      data: {
        visible: false
      }
    })
  } catch (error) {
    debug("deleteImage ERROR: ", error)
    throw { code: "images/create", message: "Image was not created!" }
  }
}

const likeImage = async (props: ImageEngageProps): Promise<Like> => {
  const data = { ...props }
  try {
    debug("likeImage", data)
    const success = await prisma.like.create({
      data: {...props}
    })
    if (success) {
      return success
    }  
    throw new Error("Unable to connect like to image")
  } catch (error) {
    info("likeImage ERROR: ", error)
    throw { code: fileMethod('likeImage'), ...{error} }
  }
}

const shareImage = async (props: ImageEngageProps): Promise<Image> => {
  const { creatorId, imageId } = props
  try {
    debug("shareImage", props)
    const image = await prisma.image.findUnique({ where: { id: imageId } })

    const updateImage = await prisma.image.update({
      where: { id: imageId },
      data: { shares: { create: { creatorId },},
    }})

    return updateImage
  } catch (error) {
    info("shareImage ERROR: ", error)
    throw { code: "images/share", message: "Image not shared!" }
  }
}

const commentOnImage = async (props: any): Promise<Image> => {
  const {commentId, creatorId, content} = props
  try {
    debug("comment", {...props})
    throw {code: fileMethod('commentOnImage'), message: 'commentOnImage not implemented'}

    // const success = await prisma.image.create({
    //   data: {
    //     creatorId,
    //     commentId,
    //     content
    //   }
    // })
    // if (success) {
    //   return success
    // }
    // else {
    //   throw ({
    //     message: 'Unable to comment on image'
    //   })
    // }
  } catch (error) {
    info("commentOnImage ERROR: ", error)
    throw error
  }
}

export const PrismaImage = { detail, details, stub, stubs, upsert, deleteImage, likeImage, shareImage, commentOnImage }
