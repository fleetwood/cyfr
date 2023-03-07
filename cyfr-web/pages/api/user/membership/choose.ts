import { Fan, Follow,PrismaUser, User, UserFeed } from "../../../../prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from "next"

import { GetResponseError, ResponseError, ResponseResult } from "../../../../types/response"
import useDebug from "../../../../hooks/useDebug"

const {debug, todo, error, fileMethod} = useDebug({fileName: 'api/user/membership/choose'})

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<UserFeed|null>>
) {
  todo('Why is this posting req.body.body????')
  const code = fileMethod('choose')
  const { audience, cadence } = req.body.body
  try {
    const user = await PrismaUser.userInSessionReq(req)
    debug('api/user/membership/choose', {user: user?.name, plan: audience, cadence})
    const result = user ? await PrismaUser.setMembership(user?.id, audience, cadence) : null
    if (result !== null) {
      res.status(200).json({ result })
    } else if (result) {
      res.status(200).json({ result: result as unknown as UserFeed | null })
    } else {
      throw { code, message: "Failed to create membership" }
    }
  } catch (e: Error | ResponseError | any) {
    error(code, e)
    const err = GetResponseError(e)
    res.status(500).json({ error: err })
  }
}