import useApiHandler from "hooks/useApiHandler"
import { PrismaUser } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const {search, all} = req.body
  
  return useApiHandler(res,
    'api/user/mentions',
    PrismaUser.canMention({search, all})
)}
export default request