import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug"
import { PrismaChapter } from "../../../prisma/prismaContext"
import {
  GetResponseError,
  ResponseError,
  ResponseResult
} from "../../../types/response"

const {debug, err, fileMethod} = useDebug('api/chapter/upsert')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<unknown>>
) {
  try {
    const {chapter} = req.body.body
    debug('handle', {chapter})
    const result = await PrismaChapter.upsert(chapter)
    if (result) {
      debug('result', {result})
      res.status(200).json({ result })
    }
    throw { code: fileMethod('upsert'), message: "Fail upsert chapterrrrr!!!!" }
    
  } catch (e: Error | ResponseError | any) {
    err("\tFAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
