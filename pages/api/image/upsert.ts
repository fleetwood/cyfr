import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug"
import { ImageUpsertProps, PrismaImage, Image } from "../../../prisma/prismaContext"
import {
    GetResponseError,
    ResponseError,
    ResponseResult
} from "../../../types/response"
const {debug, fileMethod, err} = useDebug('api/image')

/**
 * 
 * @param req.body: {@link ImageUpsertProps} 
 * @param res 
 */
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<Image>>
) {
  const props = req.body as ImageUpsertProps
  debug('handle', {...req.body, props})
  try {
    const result = await PrismaImage.upsert(props)
    if (result) {
      res.status(200).json({result})
    } else {
      throw { code: fileMethod('handle'), message: "Failed to upsert image" }
    }
  } catch (e: Error | ResponseError | any) {
    err("handle \tFAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
