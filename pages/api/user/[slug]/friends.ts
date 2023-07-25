import useApiHandler from "hooks/useApiHandler"
import { PrismaUser } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => {
  const {slug,s} = req.query
  return useApiHandler(res,
    'user/[id]/books',
    PrismaUser.friends(slug!.toString(), s?s.toString():undefined)
)}
export default request