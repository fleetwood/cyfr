import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug"
import { PrismaCharacter } from "../../../prisma/prismaContext"
import {
  GetResponseError,
  ResponseError,
  ResponseResult
} from "../../../types/response"

const {debug, err, fileMethod} = useDebug('api/character/upsert', 'DEBUG')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<unknown>>
) {
  try {
    const character = req.body.body
    debug('handle', character)
    const result = await PrismaCharacter.upsert(character)
    if (result) {
      debug('result', {result})
      res.status(200).json({ result })
    }
    throw { code: fileMethod('upsert'), message: "Fail upsert characterrrrr!!!!" }
    
  } catch (e: Error | ResponseError | any) {
    err("\tFAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
