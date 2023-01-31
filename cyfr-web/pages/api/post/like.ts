import { Post } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { Posts } from "../../../prisma/entities/post.entity"
import { ResponseResult, ResponseError, GetResponseError } from "../../../types/response"
import { todo, logError } from "../../../utils/log"
import { PostEngageProps } from "../../../prisma/types/post.def"

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
      const result = await Posts.likePost({postId, authorId})
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