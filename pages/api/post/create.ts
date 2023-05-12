import { NextApiRequest, NextApiResponse } from "next"
import {
  GetResponseError,
  ResponseError,
  ResponseResult
} from "../../../types/response"
import { logError, todo } from "../../../utils/log"
import { Post, PrismaPost } from "../../../prisma/prismaContext"
import useDebug from "../../../hooks/useDebug"

const {debug} = useDebug('api/post/create', 'DEBUG')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<Post>>
) {
  todo('Why is this posting req.body.body????')
  debug('handle', {...req.body})
  const { content, authorId, images } = req.body.body
  try {
    const result = await PrismaPost.createPost({content, authorId, images})
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
