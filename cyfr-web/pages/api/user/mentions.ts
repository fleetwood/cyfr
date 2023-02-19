import { NextApiRequest, NextApiResponse } from "next"
import { PrismaUser, User } from "../../../prisma/prismaContext"

import { getSession } from "next-auth/react"
import { GetResponseError, ResponseError, ResponseResult } from "../../../types/response"
import { logError, todo } from "../../../utils/log"

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<User[]>>
) {
  todo('Why is this posting req.body.body????')
  try {
    const session = await getSession({ req })
    const search:string|undefined = req.query.search as string
    const email = session?.user?.email
    const user = await PrismaUser.byEmail(email!)
    if (user === null) {
      res.status(200).json({ })
      res.end()
      return
    } else {
      const result = await PrismaUser.canMention(user!.id, search)

      if (result) {
        res.status(200).json({ result })
        res.end()
        return
      } else {
        throw { code: "api/user/follow", message: `No results from Follow` }
      }
    }
  } catch (e: Error | ResponseError | any) {
    logError("\tFAIL", e)
    const error = GetResponseError(e)
    res.status(200).json({ })
  }
}