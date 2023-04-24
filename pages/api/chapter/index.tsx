import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug"
import { Chapter, ChapterDetail, PrismaChapter } from "../../../prisma/prismaContext"
import {
  GetResponseError,
  ResponseError,
  ResponseResult
} from "../../../types/response"

const {debug, err, fileMethod} = useDebug('api/chapter/index', 'DEBUG')

export type ChapterMethod = 'UPSERT'|'DETAIL'|'STUB'

export type ChapterWebApiProps = {
  method:   ChapterMethod
  chapter?: Chapter
  id?:      string
}

const detail = async (id:string) => {
  const result = await PrismaChapter.detail(id)
  if (result) {
    debug('detail', result)
    return result
  } else {
    throw { code: fileMethod('detail'), message: "Fail getting chapter detail!!!!" }
  }
}

const stub = async (id:string) => {
  const result = await PrismaChapter.stub(id)
  if (result) {
    debug('detail', result)
    return result
  } else {
    throw { code: fileMethod('detail'), message: "Fail getting chapterrrrr stub!!!!" }
  }
}

const upsert = async (chapter:Chapter) => {
  const result = await PrismaChapter.upsert({
    ...chapter,
  })
  if (result) {
    debug('upsert', result)
    return result
  } else {
    throw { code: fileMethod('upsert'), message: "Fail upsert chapterrrrr!!!!" }
  }
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<unknown>>
) {
  try {
    const {method, chapter, id} = req.body.body as ChapterWebApiProps
    debug('handle',{chapter, method})
    let result = null

    switch (method) {
      case 'DETAIL':
        result = detail(id!)
        break
      case 'STUB':
        result = stub(id!)
        break
      case 'UPSERT':
        result = upsert(chapter!)
        break
      default:
        throw {code: fileMethod('handle'), message: 'Unable to determine method....'}
    }
    if (result) {
      debug('result', result)
      res.status(200).json({ result })
    }
  } catch (e: Error | ResponseError | any) {
    err("\tFAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
