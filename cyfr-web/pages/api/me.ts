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
  const code = `api/me`
  try {
    const session = await getSession({ req })
    const email = session?.user?.email
    const result = await PrismaUser.byEmail(email!)
    if (result) {
      res.status(200).json({ result })
    } else {
      log(`${code} No results`)
      throw { code, message: `No results from me` }
    }
  } catch (e: Error | ResponseError | any) {
    logError(`	me FAIL`, e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
