import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug"
import { BookUpsertProps, BookDetail, PrismaBook } from "../../../prisma/prismaContext"
import {
    GetResponseError,
    ResponseError,
    ResponseResult
} from "../../../types/response"
const {debug, err} = useDebug('api/book/upsert', 'DEBUG')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<BookDetail>>
) {
  const props:BookUpsertProps = req.body
  try {
    debug('handle',props)
    const result = await PrismaBook.upsert(props)
    if (result) {
      debug('result', result)
      res.status(200).json({ result })
    } else {
      throw { code: "api/book/upsert", message: "Fail upsert boooook!!!!" }
    }
  } catch (e: Error | ResponseError | any) {
    err("\tFAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
