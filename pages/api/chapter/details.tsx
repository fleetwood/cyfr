import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug"
import { PrismaChapter } from "../../../prisma/prismaContext"
import {
  GetResponseError,
  ResponseError,
  ResponseResult
} from "../../../types/response"

const {debug, err, fileMethod} = useDebug('api/chapter/detail')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<unknown>>
) {
  try {
    const {id} = req.body.body
    debug('handle',{id})
    const result = await PrismaChapter.detail(id)
    if (result) {
      debug('detail', result)
      res.status(200).json({ result })
    } else {
      throw { code: fileMethod('detail'), message: "Fail detail chapterrrrr!!!!" }
    }
  } catch (e: Error | ResponseError | any) {
    err("\tFAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
