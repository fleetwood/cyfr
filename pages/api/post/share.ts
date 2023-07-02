import { NextApiRequest, NextApiResponse } from "next"
import { Post } from "prisma/prismaContext"
import { ResponseResult, ResponseError, GetResponseError } from "types/response"
import { NotImplemented } from "utils/api"
import { logError } from "utils/log"

/**
 * @param req @type PostEngageProps
 * @param res @type ResponseResult:Post
 */
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<ResponseResult<Post>>
  ) {
    const { postId, creatorId,  } = req.body
    throw NotImplemented('api/post/share')
    // try {
    //   if (result) {
    //     res.status(200).json({ result })
    //   } else {
    //     throw { code: "api/post/share", message: "Failed to share post" }
    //   }
    // } catch (e: Error | ResponseError | any) {
    //   logError("\tFAIL", e)
    //   const error = GetResponseError(e)
    //   res.status(500).json({ error })
    // }
  }