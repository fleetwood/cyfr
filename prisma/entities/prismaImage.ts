import useDebug from "hooks/useDebug"
import {Image,ImageDeleteProps,ImageEngageProps,ImageUpsertProps,Like,Post,PrismaLike,PrismaShare,Share} from "prisma/prismaContext"
const {debug, info, fileMethod} = useDebug('entities/prismaImage')

const detail = async (id: string): Promise<Image | null> => await prisma.image.findUnique({where: {id}})
const details = async (): Promise<Image[]> => await prisma.image.findMany()

const stub = async (id: string): Promise<Image | null> => await prisma.image.findUnique({where: {id}})
const stubs = async (): Promise<Image[]> => await prisma.image.findMany()

const upsert = async (props: ImageUpsertProps): Promise<Image> => {
  debug('upsert', props)
  const {url} = props
  const upsert = {
    where: { url },
    create: { ...props },
    update: { ...props },
  }
  debug('upsert', upsert)
  try {
    return await prisma.image.upsert(upsert)
  } catch (error) {
    info("upsert ERROR: ", error)
    throw error
  }
}

const deleteImage = async ({imageId, creatorId}: ImageDeleteProps): Promise<Image> => {
  try {
    // TODO: Need to make sure the user in session matches the user making the request
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

/**
 * Method references {@link PrismaLike.likeImage}
 * Params {@link ImageEngageProps}
 * @param imageId: String
 * @param creatorId: String
 * @returns: {@link Like}
 */
const like = async (props: ImageEngageProps): Promise<Like> => PrismaLike.likeImage(props)

/**
 * Method references {@link PrismaShare.shareImage}
 * Params {@link ImageEngageProps}
 * @param imageId: String
 * @param creatorId: String
 * @returns: {@link Post}
 */
const share = async (props: ImageEngageProps): Promise<Share> => PrismaShare.shareImage(props)

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

export const PrismaImage = { detail, details, stub, stubs, upsert, deleteImage, like, share, commentOnImage }
