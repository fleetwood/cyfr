import { Post } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { title } from "process"
import { Posts } from "../../../prisma/posts"
import { ResponseResult, ResponseError, GetResponseError } from "../../../types/response"
import { todo, logError } from "../../../utils/log"

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<ResponseResult<Post>>
  ) {
    todo('Why is this posting req.body.body????')
    const { postid, userid } = req.body.body
    try {
      const result = await Posts.like({postid, userid})
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