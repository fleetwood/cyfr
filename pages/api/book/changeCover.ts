import { NextApiRequest, NextApiResponse } from "next"

import useDebug from "hooks/useDebug"
import { ChangeCoverProps, PrismaBook } from "prisma/prismaContext"
import { ResponseError, GetResponseError } from "types/response"
const { debug, err } = useDebug("api/book/changeCover")

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { book, newImage: image, cover, imageId } = req.body as ChangeCoverProps
  debug("handle", {book, image, cover, imageId})
  try {
    const result = await PrismaBook.changeCover({book, newImage: image, cover, imageId})
    if (result) {
      res.status(200).json({ result })
    } else {
      throw {
        code: "api/book/changeCover",
        message: `No results from changeCover`,
      }
    }
  } catch (e: Error | ResponseError | any) {
    err("FAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
