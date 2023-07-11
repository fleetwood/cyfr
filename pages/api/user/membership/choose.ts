import { NextApiRequest, NextApiResponse } from "next"
import { PrismaUser } from "prisma/prismaContext"

import useDebug from "hooks/useDebug"
import { GetResponseError, ResponseError } from "types/response"

const {debug, todo, err, fileMethod} = useDebug('api/user/membership/choose', 'DEBUG')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { typeId, cadence } = req.body
  try {
    const user = await PrismaUser.userInSessionReq(req)
    debug('handle', {user: user?.name, typeId, cadence, membershipId: user?.membershipId})
    const result = user ? await PrismaUser.setMembership(user, typeId, cadence) : null
    if (result) {
      debug('choose.result', 'null result')
      res.status(200).json(result)
    } else {
      throw { code: 'api/user/membership/choose', message: "Failed to create membership" }
    }
  } catch (e: Error | ResponseError | any) {
    err(e.code ?? e)
    res.status(500).json({ error: GetResponseError(e) })
  }
}