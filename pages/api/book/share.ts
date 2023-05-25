import { NextApiRequest, NextApiResponse } from "next"
import { PrismaBook, Share } from "../../../prisma/prismaContext"

import useDebug from "../../../hooks/useDebug"
import {
  GetResponseError,
  ResponseError,
  ResponseResult,
} from "../../../types/response"
const { todo, err } = useDebug("api/book/share")

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<Share>>
) {
  // TODO Unshare
  const { bookId, authorId } = req.body
  try {
    const result = await PrismaBook.share({bookId, authorId})
    if (result) {
      res.status(200).json({ result })
    } else {
      throw { code: "api/book/share", message: `No results from Share` }
    }
  } catch (e: Error | ResponseError | any) {
    err("FAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
