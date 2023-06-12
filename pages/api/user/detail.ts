import { NextApiRequest, NextApiResponse } from "next"

import useDebug from "hooks/useDebug"
import { PrismaUser } from "prisma/prismaContext"

const {debug, stringify, fileMethod} = useDebug('api/user/[id]')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {id, name, email, slug} = req.body
  try {
    const result = await PrismaUser.detail(id ?? name ?? email ?? slug)
    if (!result)  {
      throw { code: fileMethod('handle'), message: `No results for (${id})` }
    }
    res.status(200).json({ result })
    
  } catch (e) {
    debug(fileMethod("handle"), {e})
    res.status(500).json({ error: { code: "api/error", message: stringify(e) } })
  }
}