import { NextApiRequest, NextApiResponse } from "next"
import {
  GetResponseError,
  ResponseError,
  ResponseResult
} from "../../../types/response"
import { logError, todo } from "../../../utils/log"
import { Post, Posts } from "../../../prisma/prismaContext"

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<Post>>
) {
  todo('Why is this posting req.body.body????')
  const { content, authorId } = req.body.body
  try {
    const result = await Posts.createPost({content, authorId})
    if (result) {
      res.status(200).json({ result })
    } else {
      throw { code: "api/post/create", message: "Failed to create posts" }
    }
  } catch (e: Error | ResponseError | any) {
    logError("\tFAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
