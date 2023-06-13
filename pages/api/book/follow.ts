import { NextApiRequest, NextApiResponse } from "next"
import { Follow, PrismaBook } from "../../../prisma/prismaContext"

import useDebug from "../../../hooks/useDebug"
import {
    GetResponseError,
    ResponseError,
    ResponseResult,
} from "../../../types/response"
const { debug, err } = useDebug("api/book/follow")

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<Follow>>
) {
  // TODO Unfollow/Unfan
  const {body} = req
  const { bookId, followerId, isFan = false } = body
  debug('handle', {bookId, followerId, isFan, body})
  try {
    const result = await PrismaBook.follow({bookId, followerId, isFan})
    if (result) {
      debug('handle', result)
      res.status(200).json({ result })
    } else {
      throw { code: "api/book/follow", message: `No results from Follow` }
    }
  } catch (e: Error | ResponseError | any) {
    const error = GetResponseError(e)
    debug('handle FAIL', {e, error})
    res.status(500).json({ error })
  }
}
