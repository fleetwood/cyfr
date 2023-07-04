import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "hooks/useDebug"
import { PrismaGallery } from "prisma/prismaContext"
import {
  GetResponseError,
  ResponseError
} from "types/response"

const {todo, err} = useDebug("api/gallery/feed")

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await PrismaGallery.stubs()
    if (result) {
      res.status(200).json(result)
    } else {
      throw { code: "api/gallery/feed", message: "Failed to find gallery stubs" }
    }
  } catch (e: Error | ResponseError | any) {
    err("handle.error", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
