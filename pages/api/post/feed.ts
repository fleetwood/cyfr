import useApiHandler from "hooks/useApiHandler"
import { NextApiRequest, NextApiResponse } from "next"
import { PrismaPost } from "prisma/prismaContext"

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  //TODO create scalable pagination logic
  // const {pg, limit} = req.query
  // const skip = pg ? parseInt(pg as string) : 0
  // const take = limit ? parseInt(limit as string) : 10

  return useApiHandler(res,
    'api/post/feed',
    PrismaPost.feed({take: 10, skip: 0}),
    'DEBUG'
)}
export default request