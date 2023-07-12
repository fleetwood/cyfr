import useApiHandler from "hooks/useApiHandler"
import { PrismaUser } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const { typeId, cadence } = req.body
  const user = await PrismaUser.userInSessionReq(req)

  return useApiHandler(res,
    'api/user/membership/choose',
    PrismaUser.setMembership(user, typeId, cadence)
)}
export default request
