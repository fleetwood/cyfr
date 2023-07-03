import { NextApiRequest, NextApiResponse } from "next"
import { Genre, PrismaGenre } from "../../../prisma/prismaContext"
import {
    GetResponseError,
    ResponseError,
    ResponseResult
} from "../../../types/response"
import { logError, todo } from "../../../utils/log"

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title } = req.body
  try {
    const result = await PrismaGenre.deleteGenre({title})
    if (result) {
      res.status(200).json(result)
    } else {
      throw { code: "api/genre/delete", message: "Failed to delete genre" }
    }
  } catch (e: Error | ResponseError | any) {
    logError("\tFAIL", e)
    const error = GetResponseError(e)
    res.status(200).json({ })
  }
}
