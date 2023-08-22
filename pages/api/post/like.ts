import useApiHandler from "hooks/useApiHandler"
import { PostEngageProps, PrismaPost } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => useApiHandler(res,'api/post/feed',PrismaPost.likePost(req.body as PostEngageProps))
export default request
