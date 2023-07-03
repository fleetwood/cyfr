import { NextApiRequest, NextApiResponse } from "next"
import { Like, PostEngageProps, PrismaPost } from "prisma/prismaContext"
import { ResponseResult, ResponseError, GetResponseError } from "types/response"
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
    const { postId, creatorId } = req.body as PostEngageProps
    try {
      const result = await PrismaPost.likePost({postId, creatorId})
      if (result) {
        res.status(200).json(result)
      } else {
        throw { code: "api/post/like", message: "Failed to like post" }
      }
    } catch (e: Error | ResponseError | any) {
      logError("\tFAIL", e)
      const error = GetResponseError(e)
      res.status(500).json({ error })
    }
  }