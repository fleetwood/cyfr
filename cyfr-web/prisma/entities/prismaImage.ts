import { Image, User, Like, ImageDetail,ImageFeed, ImageCreateProps, ImageDeleteProps, ImageEngageProps, ImageDetailInclude, ImageFeedInclude } from "../prismaContext"
import { log, todo } from "../../utils/log"

const fileName = 'prismaImage'
const fileMethod = (method:string) => `${fileName}.${method}`
const trace = (method:string, t?:any) => log(fileMethod(method)+t?' '+JSON.stringify(t,null,2) :'')

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
  trace('all')
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
    trace('createImage', data)
    return await prisma.image.create({ data })
  } catch (error) {
    trace("\tcreateImage ERROR: ", error)
    throw { code: "images/create", message: "Image was not created!" }
  }
}

const deleteImage = async ({imageId, authorId}: ImageDeleteProps): Promise<Image> => {
  try {
    todo('Need to make sure the user in session matches the user making the request')
    trace("deleteImage", {imageId, authorId})
    return await prisma.image.update({ 
      where: {
        id: imageId,
      },
      data: {
        visible: false
      }
    })
  } catch (error) {
    trace("deleteImage ERROR: ", error)
    throw { code: "images/create", message: "Image was not created!" }
  }
}

const likeImage = async (props: ImageEngageProps): Promise<Like> => {
  const data = { ...props }
  try {
    trace("likeImage", data)
    const success = await prisma.like.create({
      data: {...props}
    })
    if (success) {
      return success
    }  
    throw new Error("Unable to connect like to image")
  } catch (error) {
    log("\tERROR: ", error)
    throw { code: fileMethod('likeImage'), ...{error} }
  }
}

const shareImage = async (props: ImageEngageProps): Promise<Image> => {
  const { authorId, imageId } = props
  try {
    log("Images.share", props)
    const image = await prisma.image.findUnique({ where: { id: imageId } })

    const updateImage = await prisma.image.update({
      where: { id: imageId },
      data: { shares: { create: { authorId },},
    }})

    return updateImage
  } catch (error) {
    log("\tERROR: ", error)
    throw { code: "images/share", message: "Image not shared!" }
  }
}

const commentOnImage = async (props: any): Promise<Image> => {
  const {commentId, authorId, content} = props
  try {
    throw {code: fileMethod, message: 'commentOnImage not implemented'}

    log("Images.comment", {...props})
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
    log("\tERROR: ", error)
    throw error
  }
}

export const PrismaImage = { all, byId, createImage, deleteImage, likeImage, shareImage, commentOnImage }
