import useApiHandler from "hooks/useApiHandler"
import { PrismaComment, PrismaUser } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const user = await PrismaUser.userInSessionReq(req)
  return useApiHandler(res,
    'api/user/[slug]/inbox',
    PrismaComment.userInbox(user!.id)
)}
export default request