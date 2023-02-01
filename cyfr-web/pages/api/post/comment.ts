import { NextApiRequest, NextApiResponse } from "next"
import { ResponseResult, ResponseError, GetResponseError } from "../../../types/response"
import { todo, logError } from "../../../utils/log"
import { Post, PrismaPost } from "../../../prisma/prismaContext"

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<ResponseResult<Post>>
  ) {
    todo('Why is this posting req.body.body????')
    const { commentId, authorId, content } = req.body.body
    try {
      const result = await PrismaPost.commentOnPost({commentId, authorId, content})
      if (result) {
        res.status(200).json({ result })
      } else {
        throw { code: "api/post/comment", message: "Failed to comment on post" }
      }
    } catch (e: Error | ResponseError | any) {
      logError("\tFAIL", e)
      const error = GetResponseError(e)
      res.status(500).json({ error })
    }
  }