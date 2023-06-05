import { NextApiRequest, NextApiResponse } from "next"
import {
  ResponseError,
} from "../../types/response"
import { PrismaUser } from "../../prisma/prismaContext"
import useDebug from "../../hooks/useDebug"
const {debug,err} = useDebug('api/me', 'DEBUG')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await PrismaUser.userInSessionReq(req)
    debug('result', result)
    res.status(200).json({ result })
  } catch (e: Error | ResponseError | any) {
    err(`FAIL`, e)
    res.status(200).json({ })
  }
}
