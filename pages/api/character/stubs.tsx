import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug"
import { PrismaCharacter } from "../../../prisma/prismaContext"
import {
  GetResponseError,
  ResponseError,
  ResponseResult
} from "../../../types/response"

const {debug, err, fileMethod} = useDebug('api/character/stub')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<unknown>>
) {
  try {
    const {id} = req.body.body
    debug('handle',{id})
    const result = await PrismaCharacter.stub(id)
    if (result) {
      debug('stub', result)
      res.status(200).json({ result })
    }
    
    throw { code: fileMethod('upsert'), message: "Fail stub characterrrrr!!!!" }
    
  } catch (e: Error | ResponseError | any) {
    err("\tFAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
