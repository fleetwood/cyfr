import { NextApiRequest, NextApiResponse } from "next"
import { PrismaUser, UserFeed } from "../../../../prisma/prismaContext"

import useDebug from "../../../../hooks/useDebug"
import { GetResponseError, ResponseError, ResponseResult } from "../../../../types/response"

const {debug, todo, err, fileMethod} = useDebug('api/user/membership/choose')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<UserFeed|null>>
) {
  todo('handle','Why is this posting req.body.body????')
  const code = fileMethod('choose')
  const { audience, cadence } = req.body.body
  try {
    const user = await PrismaUser.userInSessionReq(req)
    debug('choose', {user: user?.name, plan: audience, cadence})
    const result = user ? await PrismaUser.setMembership(user?.id, audience, cadence) : null
    if (result !== null) {
      debug('choose.result', 'null result')
      res.status(200).json({ result })
    } else if (result) {
      res.status(200).json({ result: result as unknown as UserFeed | null })
    } else {
      throw { code, message: "Failed to create membership" }
    }
  } catch (e: Error | ResponseError | any) {
    err(code, e)
    res.status(500).json({ error: GetResponseError(e) })
  }
}