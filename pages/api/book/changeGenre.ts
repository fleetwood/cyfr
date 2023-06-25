import useDebug from "hooks/useDebug"
import { NextApiRequest, NextApiResponse } from "next"
import { ChangeGenreProps, PrismaBook } from "prisma/prismaContext"
import { ResponseError, GetResponseError } from "types/response"
const { debug, err } = useDebug("api/book/changeGenre")

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { bookId, genreId } = req.body as ChangeGenreProps
  debug("handle", {bookId, genreId})
  try {
    const result = await PrismaBook.changeGenre({bookId, genreId})
    if (result) {
      res.status(200).json({ result })
    } else {
      throw {
        code: "api/book/changeGenre",
        message: `No results from changeGenre`,
      }
    }
  } catch (e: Error | ResponseError | any) {
    err("FAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
