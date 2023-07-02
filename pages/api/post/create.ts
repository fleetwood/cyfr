import useDebug from "hooks/useDebug"
import { NextApiRequest, NextApiResponse } from "next"
import { Post, PrismaPost } from "prisma/prismaContext"
import { ResponseResult, ResponseError, GetResponseError } from "types/response"
import { logError } from "utils/log"

const {debug} = useDebug('api/post/create')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<Post>>
) {
  debug('handle', {...req.body})
  const { content, creatorId, images } = req.body
  try {
    const result = await PrismaPost.createPost({content, creatorId, images})
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
