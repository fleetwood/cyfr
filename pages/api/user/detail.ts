import useApiHandler from "hooks/useApiHandler"
import { PrismaUser } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const {id, name, email, slug} = req.body
  
  return useApiHandler(res,
    'api/user/[id]',
    PrismaUser.detail(id ?? name ?? email ?? slug)
)}
export default request