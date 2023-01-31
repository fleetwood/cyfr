import { NextApiRequest, NextApiResponse } from "next"

import {
  GetResponseError,
  ResponseError,
  ResponseResult,
} from "../../types/response"
import { log, logError, todo } from "../../utils/log"
import { getSession } from "next-auth/react"
import { Users } from "../../prisma/prismaContext"

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const code = `api/me`
  log(`${code} email: ${session?.user?.email}`)
  try {
    const email = session?.user?.email
    const result = await Users.byEmail(email!)
    if (result) {
      log(`${code} results: ${result.id}`)
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
