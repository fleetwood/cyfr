import useApiHandler from 'hooks/useApiHandler'
import { PrismaPost } from 'prisma/prismaContext'
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => useApiHandler(res,
  'api/post/[id]',
  PrismaPost.postDetail(req.query.id!.toString())
)

export default request
