import { NextApiRequest, NextApiResponse } from "next"
import { GetResponseError, ResponseError, ResponseResult } from "types/response"

import useDebug from "hooks/useDebug"
import { PostDetail, PrismaPost } from "prisma/prismaContext"

const {info} = useDebug('api/post/comment')

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<ResponseResult<PostDetail>>
  ) {
    const { postId, creatorId, content } = req.body
    try {
      const result = await PrismaPost.commentOnPost({postId, creatorId, content})
      if (result) {
        res.status(200).json({ result })
      } else {
        throw { code: "api/post/comment", message: "Failed to comment on post" }
      }
    } catch (e: Error | ResponseError | any) {
      info("\tFAIL", e)
      const error = GetResponseError(e)
      res.status(500).json({ error })
    }
  }