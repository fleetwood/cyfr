import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug"
import { Chapter, PrismaChapter } from "../../../prisma/prismaContext"
import {
  GetResponseError,
  ResponseError,
  ResponseResult
} from "../../../types/response"
const {debug, err} = useDebug('api/chapter/sort', 'DEBUG')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<Chapter[]>>
) {
  try {
  const {currentChapters, changedChapter} = req.body.body
  
    debug('handle',{currentChapters,changedChapter})
    const result = await PrismaChapter.sort(currentChapters,changedChapter)
    if (result) {
      debug('result', result)
      res.status(200).json({ result})
    } else {
      throw { code: "api/chapter/sort", message: "Fail upsert chapterrrrr!!!!" }
    }
  } catch (e: Error | ResponseError | any) {
    err("\tFAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
