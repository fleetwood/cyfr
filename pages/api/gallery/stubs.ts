import useDebug from "hooks/useDebug"
import { NextApiRequest, NextApiResponse } from "next"
import { PrismaGallery } from "prisma/prismaContext"
import {
  GetResponseError,
  ResponseError
} from "types/response"

const {todo, err} = useDebug("api/gallery/stubs")

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await PrismaGallery.stubs()
    if (result) {
      res.status(200).json(result)
    } else {
      throw { code: "api/gallery/stubs", message: "Failed to find gallery stubs" }
    }
  } catch (e: Error | ResponseError | any) {
    err("handle.error", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
