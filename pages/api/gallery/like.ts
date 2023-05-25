import { NextApiRequest, NextApiResponse } from "next"
import { Post, PrismaPost, PostEngageProps, Like, PrismaGallery, GalleryEngageProps } from "../../../prisma/prismaContext"
import { ResponseResult, ResponseError, GetResponseError } from "../../../types/response"
import { todo, logError, log } from "../../../utils/log"

/**
 * 
 * @param req (@type PostEngageProps)
 * @param res (@type ResponseResult:Post)
 */
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<ResponseResult<Like>>
  ) {
    const { galleryId, authorId } = req.body as GalleryEngageProps
    try {
      const result = await PrismaGallery.like({galleryId, authorId})
      if (result) {
        res.status(200).json({ result })
      } else {
        throw { code: "api/gallery/like", message: "Failed to like gallery" }
      }
    } catch (e: Error | ResponseError | any) {
      logError("\tFAIL", e)
      const error = GetResponseError(e)
      res.status(500).json({ error })
    }
  }