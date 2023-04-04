import { NextApiRequest, NextApiResponse } from "next"
import { Like, PrismaGallery, GalleryEngageProps, Share } from "../../../prisma/prismaContext"
import { ResponseResult, ResponseError, GetResponseError } from "../../../types/response"
import { logError } from "../../../utils/log"

/**
 * @param req (@type PostEngageProps)
 * @param res (@type ResponseResult:Post)
 */
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<ResponseResult<Share>>
  ) {
    const { galleryId, authorId } = req.body.body as GalleryEngageProps
    try {
      const result = await PrismaGallery.share({galleryId, authorId})
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