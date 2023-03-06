import { NextApiRequest, NextApiResponse } from "next"
import { GenreFeed, PrismaGenre } from "../../../prisma/prismaContext"
import {
    GetResponseError,
    ResponseError,
    ResponseResult
} from "../../../types/response"
import { logError, todo } from "../../../utils/log"

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<GenreFeed>>
) {
  todo('Why is this posting req.body.body????')
  const { title, description } = req.body.body
  try {
    const result = await PrismaGenre.upsertGenre({title, description})
    if (result) {
      res.status(200).json({ result })
    } else {
      throw { code: "api/genre/upsert", message: "Failed to create genre" }
    }
  } catch (e: Error | ResponseError | any) {
    logError("\tFAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
