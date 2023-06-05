import { NextApiRequest, NextApiResponse } from "next"
import { BookDetail, PrismaBook } from "../../../prisma/prismaContext"

import useDebug from "../../../hooks/useDebug"
import {
  GetResponseError,
  ResponseError,
  ResponseResult,
} from "../../../types/response"
const { debug, err } = useDebug("api/book/addGallery")

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { galleryId, bookId } = req.body
  debug("handle", {galleryId, bookId})
  try {
    const result = await PrismaBook.addGallery({galleryId, bookId})
    if (result) {
      res.status(200).json({ result })
    } else {
      throw {
        code: "api/book/addGallery",
        message: `No results from addGallery`,
      }
    }
  } catch (e: Error | ResponseError | any) {
    err("FAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
