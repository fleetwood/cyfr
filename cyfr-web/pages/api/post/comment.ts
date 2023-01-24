import { Post } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { Posts } from "../../../prisma/posts"
import { ResponseResult, ResponseError, GetResponseError } from "../../../types/response"
import { todo, logError } from "../../../utils/log"

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<ResponseResult<Post>>
  ) {
    todo('Why is this posting req.body.body????')
    const { commentId, authorid, content } = req.body.body
    try {
      const result = await Posts.comment({commentId, authorid, content})
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