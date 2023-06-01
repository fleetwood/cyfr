import { NextApiRequest, NextApiResponse } from "next"
import { Post, PrismaPost } from "../../../prisma/prismaContext"
import { ResponseResult, ResponseError, GetResponseError } from "../../../types/response"
import { todo, logError } from "../../../utils/log"

/**
 * @param req @type PostEngageProps
 * @param res @type ResponseResult:Post
 */
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<ResponseResult<Post>>
  ) {
    const { postId, authorId,  } = req.body
    try {
      const result = await PrismaPost.sharePost({postId, authorId})
      if (result) {
        res.status(200).json({ result })
      } else {
        throw { code: "api/post/share", message: "Failed to share post" }
      }
    } catch (e: Error | ResponseError | any) {
      logError("\tFAIL", e)
      const error = GetResponseError(e)
      res.status(500).json({ error })
    }
  }