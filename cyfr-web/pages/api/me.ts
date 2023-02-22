import { NextApiRequest, NextApiResponse } from "next"

import {
  GetResponseError,
  ResponseError,
} from "../../types/response"
import { getSession } from "next-auth/react"
import { PrismaUser } from "../../prisma/prismaContext"
import useDebug from "../../hooks/useDebug"
const [debug, error] = useDebug('api/me')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession({ req })
    if (session === null || session.user === null || session.user?.email === null) {
      debug(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\nNO USER in session....`,session)
      res.status(200).json({})
      res.end()
      return
    } else {
      debug(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\nYES USER in session....`,session)
      const email = session?.user?.email
      const result = await PrismaUser.byEmail(email!)
      res.status(200).json({ result })
    }
  } catch (e: Error | ResponseError | any) {
    error(`me FAIL`, GetResponseError(e))
    res.status(200).json({ })
  }
}
