import useApiHandler from "hooks/useApiHandler"
import { PrismaUser, UserTypes } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'
import useDebug from "hooks/useDebug"

const {debug} = useDebug('api/user/[slug]/info')

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const {slug, t} = req.query
  const userType = t?.toString() as UserTypes ?? undefined
  debug('request', {slug, t, userType})
  return useApiHandler(res,
  'api/user/[slug]/info',
  PrismaUser.userInfo(slug!.toString(), userType)
)}
export default request
