import useApiHandler from "hooks/useApiHandler"
import { PrismaUser, UserTypes } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const {slug, t} = req.query
  const userType = t?.toString() as UserTypes ??undefined
  return useApiHandler(res,
  'api/user/[slug]/info',
  PrismaUser.userInfo(slug!.toString(), userType)
)}
export default request
