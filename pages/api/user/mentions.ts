import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug"
import { PrismaUser } from "../../../prisma/prismaContext"

const {debug, todo, info} = useDebug('api/user/mentions')
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {search, all} = req.body
    const result = await PrismaUser.canMention({search, all})
    if (result) {
      debug('handle: result',{result: result.length})
      res.status(200).json(result)
      res.end()
      return
    } else {
      throw { code: "api/user/mentions", message: `No results from Mentions` }
    }
  } catch (e: Error | any) {
    info("FAIL", e)
    res.status(200).json({ })
  }
}