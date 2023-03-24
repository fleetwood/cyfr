import { NextApiRequest, NextApiResponse } from "next"

import { ResponseResult } from "../../../../types/response"
import { CyfrUser, UserDetail } from "../../../../prisma/types/user.def"
import { PrismaUser } from "../../../../prisma/entities/prismaUser"
import useDebug from "../../../../hooks/useDebug"

const {debug, err, stringify, todo, fileMethod} = useDebug('api/user/byId/[id]')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<CyfrUser>>
) {
  const id = req.query.id?.toString() || ""
  try {
    const byId = await PrismaUser.byId(id)
    todo('handle', 'Add slug to User model.')
    if (byId) {
      debug('byId', {byId})
      res.status(200).json({ result: byId })
      res.end()
      return
    }
    const byName = await PrismaUser.byName(id)
    if (byName) {
      debug('byName', {byName})
      res.status(200).json({ result: byName })
      res.end()
      return
    }
    
    throw { code: fileMethod('handle'), message: `No results for (${id})` }
  } catch (e) {
    debug(fileMethod("handle"), {e})
    res.status(500).json({ error: { code: "api/error", message: stringify(e) } })
  }
}
