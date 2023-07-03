import { NextApiRequest, NextApiResponse } from "next"
import { GalleryEngageProps, Like, PrismaGallery } from "prisma/prismaContext"
import { GetResponseError, ResponseError, ResponseResult } from "types/response"
import { logError } from "utils/log"

/**
 * 
 * @param req (@type PostEngageProps)
 * @param res (@type ResponseResult:Post)
 */
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const { galleryId, creatorId } = req.body as GalleryEngageProps
    try {
      const result = await PrismaGallery.like({galleryId, creatorId})
      if (result) {
        res.status(200).json(result)
      } else {
        throw { code: "api/gallery/like", message: "Failed to like gallery" }
      }
    } catch (e: Error | ResponseError | any) {
      logError("\tFAIL", e)
      const error = GetResponseError(e)
      res.status(500).json({ error })
    }
  }