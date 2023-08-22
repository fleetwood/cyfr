import useApiHandler from 'hooks/useApiHandler'
import { PrismaPost } from 'prisma/prismaContext'
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => {
  //TODO convert this to a type
  const { postId, creatorId, content } = req.body

  return useApiHandler(res,
    'api/post/comment',
    PrismaPost.commentOnPost({postId, creatorId, content})
)}

export default request