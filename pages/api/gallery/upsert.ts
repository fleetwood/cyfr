import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug";
import { Gallery, PrismaGallery, GalleryUpsertProps } from "../../../prisma/prismaContext"
import {
  GetResponseError,
  ResponseError,
  ResponseResult
} from "../../../types/response"
const {debug, info} = useDebug("api/gallery/upsert", 'DEBUG')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<Gallery>>
) {
  const { galleryId, authorId, title, description, images, files } = req.body.body
  debug(`handle`,{ galleryId, authorId, title, description, images, files })
  try {
    const gallery = await PrismaGallery.upsertGallery({ galleryId, authorId, title, description, images, files })
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
