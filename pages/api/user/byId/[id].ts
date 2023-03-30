import { NextApiRequest, NextApiResponse } from "next"

import useDebug from "../../../../hooks/useDebug"
import { PrismaUser } from "../../../../prisma/entities/prismaUser"
import { CyfrUser } from "../../../../prisma/types/user.def"
import { ResponseResult } from "../../../../types/response"

const {debug, stringify, fileMethod} = useDebug('api/user/byId/[id]')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<CyfrUser|null>>
) {
  const id = req.query.id?.toString() || ""
  try {
    const result = await PrismaUser.getCyfrUser(id)
    if (!result)  {
      throw { code: fileMethod('handle'), message: `No results for (${id})` }
    }
    res.status(200).json({ result })
    
  } catch (e) {
    debug(fileMethod("handle"), {e})
    res.status(500).json({ error: { code: "api/error", message: stringify(e) } })
  }
}
