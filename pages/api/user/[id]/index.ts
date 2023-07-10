import { NextApiRequest, NextApiResponse } from "next"

import useDebug from "hooks/useDebug"
import { CyfrUser, PrismaUser } from "prisma/prismaContext"
const {debug, stringify, fileMethod} = useDebug(`api/user/[slug]`, 'DEBUG')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id!.toString()
  try {
    const result = await PrismaUser.detail({slug: id})
    if (result)  {
      res.status(200).json(result)
    }
    throw ({code: 'api/user/', message: 'No result'})
  } catch (e) {
    debug('handle ERROR', e)
    res.status(500).json({ error: { code: "api/error", message: stringify(e) } })
  }
}
