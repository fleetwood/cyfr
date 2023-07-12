import useApiHandler, { NotImplemented } from "hooks/useApiHandler"
import { PostEngageProps, PrismaPost } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'


const request = (req:NextApiRequest, res: NextApiResponse) => useApiHandler(res,'api/post/share', NotImplemented()) //PrismaPost.sharePost(req.body as PostEngageProps))
export default request
