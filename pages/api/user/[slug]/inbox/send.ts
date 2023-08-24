import useApiHandler from "hooks/useApiHandler"
import { getSession } from "next-auth/react"
import { PrismaComment } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  // TODO Can't sent to blocked peeps
  // TODO convert this to a type
  // threadId, userId, partyId, messages
  const session = await getSession({req: req})
  const userId = session?.user ? req.body.userId : undefined
  return useApiHandler(res,
    'api/user/inbox/send',
    PrismaComment.upsertInbox({...req.body, ...userId})
)}
export default request
