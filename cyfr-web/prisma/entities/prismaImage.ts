import { Image, Like, ImageDetail,ImageFeed, ImageCreateProps, ImageDeleteProps, ImageEngageProps, ImageDetailInclude, ImageFeedInclude } from "../prismaContext"
import useDebug from "../../hooks/useDebug"
const {debug, info, todo, fileMethod} = useDebug({fileName: 'entities/prismaImage'})

const byId = async (id: string): Promise<ImageDetail | null> => {
  try {
    return await prisma.image.findFirst({
      where: {
        id: id,
        visible: true
      },
      include: ImageDetailInclude,
    })
  } catch (error) {
    throw { code: "images/byId", message: "No images were returned!" }
  }
}

/**
 * @satisfies visible:true
 * @satisfies commentId:null //don't include Shares
 * @returns ImageFeed[]
 */
const all = async (): Promise<ImageFeed[] | []> => {
  debug('all')
  try {
    return await prisma.image.findMany({
      where: {
        visible: true
      },
      include: ImageFeedInclude,
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
    }) as unknown as ImageFeed[]
  } catch (error) {
    throw { code: "images/all", message: "No images were returned!" }
  }
}

const createImage = async (props: ImageCreateProps): Promise<Image> => {
  const data = { ...props }
  try {
    debug('createImage', data)
    return await prisma.image.create({ data })
  } catch (error) {
    info("createImage ERROR: ", error)
    throw { code: "images/create", message: "Image was not created!" }
  }
}

const deleteImage = async ({imageId, authorId}: ImageDeleteProps): Promise<Image> => {
  try {
    todo('Need to make sure the user in session matches the user making the request')
    debug("deleteImage", {imageId, authorId})
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
  const { authorId, imageId } = props
  try {
    debug("shareImage", props)
    const image = await prisma.image.findUnique({ where: { id: imageId } })

    const updateImage = await prisma.image.update({
      where: { id: imageId },
      data: { shares: { create: { authorId },},
    }})

    return updateImage
  } catch (error) {
    info("shareImage ERROR: ", error)
    throw { code: "images/share", message: "Image not shared!" }
  }
}

const commentOnImage = async (props: any): Promise<Image> => {
  const {commentId, authorId, content} = props
  try {
    debug("comment", {...props})
    throw {code: fileMethod('commentOnImage'), message: 'commentOnImage not implemented'}

    // const success = await prisma.image.create({
    //   data: {
    //     authorId,
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

export const PrismaImage = { all, byId, createImage, deleteImage, likeImage, shareImage, commentOnImage }
