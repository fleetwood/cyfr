import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug";
import { Gallery, PrismaGallery } from "../../../prisma/prismaContext"
import {
  GetResponseError,
  ResponseError,
  ResponseResult
} from "../../../types/response"
const {debug, info} = useDebug("api/gallery/create")

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<Gallery>>
) {
  const { authorId, title, description, images } = req.body.body
  debug(`handle`,{ authorId, title, description, images })
  try {
    const gallery = await PrismaGallery.createGallery({authorId, description, title, images})
    if (gallery) {
      res.status(200).json({ result: gallery })
    } else {
      throw { code: "api/gallery/create", message: "Failed to create gallery" }
    }
  } catch (e: Error | ResponseError | any) {
    info("handle.error", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
