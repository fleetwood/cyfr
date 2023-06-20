import { NextApiRequest, NextApiResponse } from "next"
import { ChangeCoverProps, PrismaBook } from "../../../prisma/prismaContext"

import useDebug from "../../../hooks/useDebug"
import {
  GetResponseError,
  ResponseError
} from "../../../types/response"
const { debug, err } = useDebug("api/book/addCover")

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { book, image, cover } = req.body as ChangeCoverProps
  debug("handle", {book, image, cover})
  try {
    const result = await PrismaBook.changeCover({book, image, cover})
    if (result) {
      res.status(200).json({ result })
    } else {
      throw {
        code: "api/book/addCover",
        message: `No results from addCover`,
      }
    }
  } catch (e: Error | ResponseError | any) {
    err("FAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
