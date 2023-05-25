import { NextApiRequest, NextApiResponse } from "next"
import { BookDetail, PrismaBook } from "../../../prisma/prismaContext"

import useDebug from "../../../hooks/useDebug"
import {
  GetResponseError,
  ResponseError,
  ResponseResult,
} from "../../../types/response"
const { debug, err } = useDebug("api/book/addChapter")

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<BookDetail>>
) {
  const { bookId, title, order } = req.body
  debug("handle", { bookId, title, order })
  try {
    const result = await PrismaBook.addChapter({ bookId, title, order })
    if (result) {
      res.status(200).json({ result })
    } else {
      throw {
        code: "api/book/addChapter",
        message: `No results from addChapter`,
      }
    }
  } catch (e: Error | ResponseError | any) {
    err("FAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
