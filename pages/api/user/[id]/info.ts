import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "hooks/useDebug"
import { PrismaUser } from "prisma/prismaContext"

const {debug, stringify, fileMethod} = useDebug('api/user/[id]/info')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id!.toString()
  debug('handle', id)
  try {
    const result = await PrismaUser.userInfo(id)
    if (!result)  {
      debug('handle ERROR')
      throw { code: fileMethod('handle'), message: `No results for (${id})` }
    }
    debug('handle SUCCESS', result)
    res.status(200).json(result)
    
  } catch (e) {
    debug("handle CATCH", e)
    res.status(500).json({ error: { code: "api/error", message: e } })
  }
}
