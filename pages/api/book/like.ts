import { NextApiRequest, NextApiResponse } from "next"
import { Follow, Like, PrismaBook } from "prisma/prismaContext"

import useDebug from "hooks/useDebug"
import {
    GetResponseError,
    ResponseError,
    ResponseResult,
} from "types/response"
const { debug, todo, err } = useDebug("api/book/like",'DEBUG')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<Like>>
) {
  // TODO Unlike/Unfan
  const { body } = req
  const { bookId, creatorId } = body
  debug('handle', {bookId, creatorId, body})
  try {
    const result = await PrismaBook.like({bookId, creatorId})
    if (result) {
      res.status(200).json({ result })
    } else {
      throw { code: "api/book/like", message: `No results from Like` }
    }
  } catch (e: Error | ResponseError | any) {
    err("FAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
