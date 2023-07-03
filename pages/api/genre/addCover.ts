import useDebug from "hooks/useDebug"
import { NextApiRequest, NextApiResponse } from "next"
import { PrismaGenre } from "prisma/entities"
import { GenreAddCoverProps } from "prisma/types"
import { GetResponseError, ResponseError } from "types/response"

const { debug, err } = useDebug("api/genre/addCover")

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, image } = req.body as GenreAddCoverProps
  debug("handle", {id, image})
  try {
    const result = await PrismaGenre.addCover({id, image})
    if (result) {
      res.status(200).json(result)
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
