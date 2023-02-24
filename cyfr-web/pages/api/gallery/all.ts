import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug"
import { Gallery, GalleryFeed, PrismaGallery } from "../../../prisma/prismaContext"
import {
  GetResponseError,
  ResponseError,
  ResponseResult
} from "../../../types/response"
import { logError, todo } from "../../../utils/log"

const {fileMethod, debug} = useDebug({fileName: "prismaComment"})

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<GalleryFeed[]>>
) {
  todo('Why is this posting req.body.body????')
  try {
    const gallery = await PrismaGallery.all()
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
