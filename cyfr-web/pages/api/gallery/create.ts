import { NextApiRequest, NextApiResponse } from "next"
import { Gallery, PrismaGallery } from "../../../prisma/prismaContext"
import {
  GetResponseError,
  ResponseError,
  ResponseResult
} from "../../../types/response"
import { log, logError, todo } from "../../../utils/log"

const fileName = "api/gallery/";
const fileMethod = (method: string) => `${fileName}.${method}`;
const trace = (method: string, t?: any) =>
  log(fileMethod(method) + t ? " " + JSON.stringify(t, null, 2) : "");


export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<Gallery>>
) {
  const { authorId, title, description, images } = req.body.body
  trace(`handle`,{ authorId, title, description, images })
  try {
    const gallery = await PrismaGallery.createGallery({authorId, description, title, images})
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
