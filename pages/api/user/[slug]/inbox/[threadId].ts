import useApiHandler from "hooks/useApiHandler"
import { PrismaComment, PrismaUser } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  //TODO: threadById is expecting userId, threadId. Convert this to type
  const user = await PrismaUser.userInSessionReq(req)
  const { id, threadId } = req.body
  const userId = id === user.id ? id : null
  return useApiHandler(res,
    'user/[slug]/inbox/[threadId]',
    PrismaComment.threadById(userId, threadId)
)}
export default request