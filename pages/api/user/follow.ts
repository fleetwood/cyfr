import useApiHandler from "hooks/useApiHandler"
import { PrismaUser } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const { followingId, followerId, isFan = false, active = true } = req.body
  
  return useApiHandler(res,
    `api/user/follow`,
    PrismaUser.follow({followingId, followerId, isFan, active})
)}
export default request