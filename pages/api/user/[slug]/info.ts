import useApiHandler from "hooks/useApiHandler"
import { PrismaUser } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = async (req:NextApiRequest, res: NextApiResponse) => useApiHandler(res,
  'api/user/[slug]/info',
  PrismaUser.userInfo(req.query.slug!.toString())
)
export default request
