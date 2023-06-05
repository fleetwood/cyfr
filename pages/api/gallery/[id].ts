import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug"
import {
  GalleryDetail,
  PrismaGallery
} from "../../../prisma/prismaContext"
import {
  GetResponseError,
  ResponseError,
  ResponseResult,
} from "../../../types/response"

const { debug, todo, err } = useDebug("api/gallery/[id]")

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id?.toString() || ""
  try {
    const result = await PrismaGallery.detail(id)
    if (result) {
      res.status(200).json({ result })
    } else {
      throw { code: "api/gallery/create", message: "Failed to create gallery" }
    }
  } catch (e: Error | ResponseError | any) {
    err("handle.error", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
2964968594