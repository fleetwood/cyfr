import { NextApiRequest, NextApiResponse } from "next"
import { Gallery, PrismaGallery } from "../../../prisma/prismaContext"
import {
  GetResponseError,
  ResponseError,
  ResponseResult
} from "../../../types/response"
import { logError, todo } from "../../../utils/log"

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<Gallery>>
) {
  todo('Why is this posting req.body.body????')
  const { authorId, title, description, images } = req.body.body
  try {
    const gallery = await PrismaGallery.createGallery({authorId, description, title})
    if (gallery) {
      res.status(200).json({ result: gallery })
    } else {
      throw { code: "api/gallery/create", message: "Failed to create gallery" }
    }
  } catch (e: Error | ResponseError | any) {
    logError("\tFAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
