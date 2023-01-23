import { Post } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { Posts } from "../../../prisma/posts"
import {
  GetResponseError,
  ResponseError,
  ResponseResult
} from "../../../types/response"
import { logError, todo } from "../../../utils/log"

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<Post>>
) {
  todo('Why is this posting req.body.body????')
  const { content, authorid } = req.body.body
  try {
    const result = await Posts.create({content, authorid})
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
