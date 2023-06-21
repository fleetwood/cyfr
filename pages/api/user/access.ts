import useDebug from "hooks/useDebug"
import { NextApiRequest, NextApiResponse } from "next"
import { PrismaUser } from "prisma/prismaContext"
import { ResponseError } from "types/response"
const {debug,err} = useDebug('api/user/access', 'DEBUG')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {level} = req.body
    const cyfrUser = await PrismaUser.userInSessionReq(req)
    const result = await PrismaUser.canAccess(level,cyfrUser??undefined)
    debug('handle', {level, user: cyfrUser?.name, id:cyfrUser?.id??'NA', membership: cyfrUser?.membership?.level??'NA', result})
    
    res.status(200).json({ result })
  } catch (e: Error | ResponseError | any) {
    err(`FAIL`, e)
    res.status(200).json({ })
  }
}
