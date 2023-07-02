import useDebug from "hooks/useDebug"
import { NextApiRequest, NextApiResponse } from "next"
import { Gallery, PrismaGallery } from "prisma/prismaContext"
import { ResponseResult, ResponseError, GetResponseError } from "types/response"

const {debug, info} = useDebug("api/gallery/upsert")

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<Gallery>>
) {
  const { galleryId, creatorId, title, description, images, files } = req.body
  debug(`handle`,{ galleryId, creatorId, title, description, images, files })
  try {
    const gallery = await PrismaGallery.upsertGallery({ galleryId, creatorId, title, description, images, files })
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
