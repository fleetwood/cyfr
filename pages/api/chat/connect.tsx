import useApiHandler from 'hooks/useApiHandler'
import { PrismaChat } from 'prisma/entities/prismaChat'
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => useApiHandler(res,
  'api/chat/connect',
  PrismaChat.connectToChat({ ...req.body.users })
)
export default request
