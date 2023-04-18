import { NextApiRequest, NextApiResponse } from "next"
import { Follow, PrismaBook } from "../../../prisma/prismaContext"

import useDebug from "../../../hooks/useDebug"
import {
    GetResponseError,
    ResponseError,
    ResponseResult,
} from "../../../types/response"
const { todo, err } = useDebug("api/book/follow")

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<Follow>>
) {
  // TODO Unfollow/Unfan
  const { bookId, followerId, isFan = false } = req.body.body
  try {
    const result = await PrismaBook.follow({bookId, followerId, isFan})
    if (result) {
      res.status(200).json({ result })
    } else {
      throw { code: "api/book/follow", message: `No results from Follow` }
    }
  } catch (e: Error | ResponseError | any) {
    err("FAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
