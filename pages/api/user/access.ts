import useApiHandler from 'hooks/useApiHandler'
import { PrismaUser } from 'prisma/prismaContext'
import { NextApiRequest, NextApiResponse } from 'next'

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const { level } = req.body
  const cyfrUser = await PrismaUser.userInSessionReq(req)

  return useApiHandler(res,
    'api/user/access',
    PrismaUser.canAccess(level, cyfrUser ?? undefined)
)}
export default request
