import useApiHandler from 'hooks/useApiHandler'
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaComment } from 'prisma/prismaContext'

const request = (req:NextApiRequest, res: NextApiResponse) => {
  const {creatorId, threadId, content} = req.body
  return useApiHandler(res,
  'api/comment/add',
  PrismaComment.addComment({creatorId, threadId, content})
)}

export default request
