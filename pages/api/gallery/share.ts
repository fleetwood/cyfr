import { NextApiRequest, NextApiResponse } from "next"
import { GalleryEngageProps, Post, PrismaGallery } from "prisma/prismaContext"
import { GetResponseError, ResponseError, ResponseResult } from "types/response"
import { logError } from "utils/log"

/**
 * @param req (@type PostEngageProps)
 * @param res (@type ResponseResult:Post)
 */
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<ResponseResult<Post>>
  ) {
    const { galleryId, creatorId } = req.body as GalleryEngageProps
    try {
      const result = await PrismaGallery.share({galleryId, creatorId})
      if (result) {
        res.status(200).json({ result })
      } else {
        throw { code: "api/gallery/share", message: "Failed to share gallery" }
      }
    } catch (e: Error | ResponseError | any) {
      logError("\tFAIL", e)
      const error = GetResponseError(e)
      res.status(500).json({ error })
    }
  }