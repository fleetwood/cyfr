import useApiHandler from "hooks/useApiHandler"
import { PrismaPost } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => {
  const { content, creatorId, images } = req.body
  
  return useApiHandler(res,
    'api/post/create',
    PrismaPost.createPost({content, creatorId, images})
)}

export default request