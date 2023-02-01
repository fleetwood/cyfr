import { NextApiRequest, NextApiResponse } from "next"
import { Post, PrismaPost, PostEngageProps } from "../../../prisma/prismaContext"
import { ResponseResult, ResponseError, GetResponseError } from "../../../types/response"
import { todo, logError } from "../../../utils/log"

/**
 * 
 * @param req (@type PostEngageProps)
 * @param res (@type ResponseResult:Post)
 */
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<ResponseResult<Post>>
  ) {
    todo('Why is this posting req.body.body????')
    const { postId, authorId } = req.body.body as PostEngageProps
    try {
      const result = await PrismaPost.likePost({postId, authorId})
      if (result) {
        res.status(200).json({ result })
      } else {
        throw { code: "api/post/like", message: "Failed to like post" }
      }
    } catch (e: Error | ResponseError | any) {
      logError("\tFAIL", e)
      const error = GetResponseError(e)
      res.status(500).json({ error })
    }
  }