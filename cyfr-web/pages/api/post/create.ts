import { Post } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { stringify } from "querystring"
import { Posts } from "../../../prisma/posts"
import {
  GetResponseError,
  ResponseError,
  ResponseResult,
} from "../../../types/response"
import { logError, jsonify, log, todo } from "../../../utils/log"

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<Post>>
) {
    todo('Why is this posting req.body.body????')
  const { title, subtitle, content, headerImage, authorid } = req.body.body
  try {
    const result = await Posts.create({title, content, subtitle, headerImage, authorid})
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
