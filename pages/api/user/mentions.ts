import { NextApiRequest, NextApiResponse } from "next"
import { PrismaUser, User } from "../../../prisma/prismaContext"

import { getSession } from "next-auth/react"
import { GetResponseError, ResponseError, ResponseResult } from "../../../types/response"
import useDebug from "../../../hooks/useDebug"
const {debug, todo, info} = useDebug('api/user/mentions')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<User[]>>
) {
  todo('handle','Why is this posting req.body.body????')
  try {
    const user = await PrismaUser.userInSessionReq(req)
    const search:string|undefined = req.query.search as string
    if (user === null) {
      res.status(200).json({ })
      res.end()
      return
    } else {
      debug(`handle`,{user: user.id, search})
      const result = await PrismaUser.canMention(user!.id, search)

      if (result) {
        debug('handle: result',result)
        res.status(200).json({ result })
        res.end()
        return
      } else {
        throw { code: "api/user/mentions", message: `No results from Mentions` }
      }
    }
  } catch (e: Error | ResponseError | any) {
    info("FAIL", e)
    const error = GetResponseError(e)
    res.status(200).json({ })
  }
}