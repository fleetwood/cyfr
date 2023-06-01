import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../hooks/useDebug"
import { PrismaUser } from "../../prisma/prismaContext"
import { ResponseResult } from "../../types/response"

const {debug, err, stringify, todo, fileMethod} = useDebug('api/users')
const file = fileMethod("handle")

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const limit = Number(req.query.limit || 100)
  const offset = Number(req.query.offset || 0)
  const data = {limit, offset}
  try {
    const allUsers = await PrismaUser.allUsersQuery(data)
    if (allUsers) {
      debug('allUsers', {allUsers: allUsers.length, ...data})
      res.status(200).json({ result: allUsers })
      res.end()
      return
    }    
    throw { code: file, message: `No results for (${data})` }
  } catch (e) {
    debug(file, {e})
    res.status(500).json({ error: { code: file, message: stringify(e) } })
  }
}
