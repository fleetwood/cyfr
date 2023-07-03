import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug"
import { PrismaCharacter } from "../../../prisma/prismaContext"
import {
  GetResponseError,
  ResponseError,
  ResponseResult
} from "../../../types/response"

const {debug, err, fileMethod} = useDebug('api/character/detail')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {id} = req.body
    debug('handle',{id})
    const result = await PrismaCharacter.detail(id)
    if (result) {
      debug('detail', result)
      res.status(200).json(result)
    } else {
      throw { code: fileMethod('detail'), message: "Fail detail characterrrrr!!!!" }
    }
  } catch (e: Error | ResponseError | any) {
    err("\tFAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
