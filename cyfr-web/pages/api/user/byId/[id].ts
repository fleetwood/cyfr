import { NextApiRequest, NextApiResponse } from "next"

import { ResponseResult } from "../../../../types/response"
import { logError, jsonify } from "../../../../utils/log"
import { UserDetail } from "../../../../prisma/types/user.def"
import { PrismaUser } from "../../../../prisma/entities/prismaUser"
import useDebug from "../../../../hooks/useDebug"

const {debug, fileMethod} = useDebug({fileName: 'api/user/byId/[id]'})

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<UserDetail>>
) {
  const id = req.query.id?.toString() || ""
  try {
    const byId = await PrismaUser.byId(id)
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
    
    throw { code: fileMethod(''), message: `No results for (${id})` }
  } catch (e) {
    debug(fileMethod(" FAIL"), {e})
    res.status(500).json({ error: { code: "api/error", message: jsonify(e) } })
  }
}
