import { NextApiRequest, NextApiResponse } from "next"
import { Follow, Like, PrismaBook } from "../../../prisma/prismaContext"

import useDebug from "../../../hooks/useDebug"
import {
    GetResponseError,
    ResponseError,
    ResponseResult,
} from "../../../types/response"
const { todo, err } = useDebug("api/book/like")

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<Like>>
) {
  // TODO Unlike/Unfan
  const { bookId, authorId } = req.body.body
  try {
    const result = await PrismaBook.like({bookId, authorId})
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
