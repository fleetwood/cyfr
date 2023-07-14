import useApiHandler from "hooks/useApiHandler"
import { PrismaUser } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => {
  const slug = req.query.slug!.toString()
  return useApiHandler(res,
    'user/[slug]/galleries',
    PrismaUser.galleries({slug})
)}
export default request