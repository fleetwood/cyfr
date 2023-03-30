import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug"
import { GenreFeed, PrismaGenre } from "../../../prisma/prismaContext"
import {
    GetResponseError,
    ResponseError,
    ResponseResult
} from "../../../types/response"
const {debug, err} = useDebug('api/genre')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<GenreFeed>>
) {
  const { title, description, fiction } = req.body.body
  try {
    debug('handle', {title, description, fiction})
    const result = await PrismaGenre.upsertGenre({title, description, fiction})
    if (result) {
      res.status(200).json({ result })
    } else {
      throw { code: "api/genre/upsert", message: "Failed to create genre" }
    }
  } catch (e: Error | ResponseError | any) {
    err("\tFAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
