import { NextApiRequest, NextApiResponse } from "next"

import {
  GetResponseError,
  ResponseError,
} from "../../types/response"
import { PrismaUser } from "../../prisma/prismaContext"
import useDebug from "../../hooks/useDebug"
const {error} = useDebug({fileName: 'api/me'})

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await PrismaUser.userInSessionReq(req)
    res.status(200).json({ result })
  } catch (e: Error | ResponseError | any) {
    error(`me FAIL`, GetResponseError(e))
    res.status(200).json({ })
  }
}
