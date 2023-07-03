import { NextApiRequest, NextApiResponse } from "next"
import { PrismaUser } from "prisma/prismaContext"

import useDebug from "hooks/useDebug"
import { GetResponseError, ResponseError } from "types/response"

const {debug, todo, err, fileMethod} = useDebug('api/user/membership/choose')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = fileMethod('choose')
  const { audience, cadence } = req.body
  try {
    const user = await PrismaUser.userInSessionReq(req)
    debug('choose', {user: user?.name, plan: audience, cadence})
    const result = user ? await PrismaUser.setMembership(user?.id, audience, cadence) : null
    if (result) {
      debug('choose.result', 'null result')
      res.status(200).json(result)
    } else {
      throw { code, message: "Failed to create membership" }
    }
  } catch (e: Error | ResponseError | any) {
    err(code, e)
    res.status(500).json({ error: GetResponseError(e) })
  }
}