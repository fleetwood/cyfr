import useApiHandler from 'hooks/useApiHandler'
import { PrismaChat } from 'prisma/entities/prismaChat'
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => useApiHandler(res,
  'api/chat/message/send',
  PrismaChat.sendMessage(req.body.message)
)
export default request
