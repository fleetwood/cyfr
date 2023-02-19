import { NextApiRequest, NextApiResponse } from "next"

import {
  GetResponseError,
  ResponseError,
} from "../../types/response"
import { log, logError } from "../../utils/log"
import { getSession } from "next-auth/react"
import { PrismaUser } from "../../prisma/prismaContext"

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession({ req })
    if (session === null || session.user === null || session.user?.email === null) {
      // log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\nNO USER in session.... ${JSON.stringify(session, null, 2)}`)
      res.status(200).json({})
      res.end()
      return
    } else {
      // log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\nYES USER in session.... ${JSON.stringify(session, null, 2)}`)
      const email = session?.user?.email
      const result = await PrismaUser.byEmail(email!)
      res.status(200).json({ result })
    }
  } catch (e: Error | ResponseError | any) {
    logError(`me FAIL`, e)
    const error = GetResponseError(e)
    res.status(200).json({ })
  }
}
