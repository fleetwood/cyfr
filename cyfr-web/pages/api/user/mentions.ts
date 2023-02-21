import { NextApiRequest, NextApiResponse } from "next"
import { PrismaUser, User } from "../../../prisma/prismaContext"

import { getSession } from "next-auth/react"
import { GetResponseError, ResponseError, ResponseResult } from "../../../types/response"
import { log, logError, todo } from "../../../utils/log"

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
      // log(`api/user/mentions ${JSON.stringify({user: user.id, search}, null, 1)}`)
      const result = await PrismaUser.canMention(user!.id, search)

      if (result) {
        // log(`\tapi/user/mentions result: ${JSON.stringify(result, null, 1)}`)
        res.status(200).json({ result })
        res.end()
        return
      } else {
        throw { code: "api/user/mentions", message: `No results from Mentions` }
      }
    }
  } catch (e: Error | ResponseError | any) {
    logError("\tFAIL", e)
    const error = GetResponseError(e)
    res.status(200).json({ })
  }
}