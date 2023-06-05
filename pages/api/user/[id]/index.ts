import { NextApiRequest, NextApiResponse } from "next"

import useDebug from "../../../../hooks/useDebug"
import { CyfrUser, PrismaUser } from "../../../../prisma/prismaContext"
import { ResponseResult } from "../../../../types/response"

const {debug, stringify, fileMethod} = useDebug('api/user/[id]')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id?.toString() || ""
  try {
    const result = await PrismaUser.detail(id)
    if (!result)  {
      throw { code: fileMethod('handle'), message: `No results for (${id})` }
    }
    res.status(200).json({ result })
    
  } catch (e) {
    debug(fileMethod("handle"), {e})
    res.status(500).json({ error: { code: "api/error", message: stringify(e) } })
  }
}
