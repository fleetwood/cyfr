import useApiHandler from "hooks/useApiHandler"
import { PrismaUser } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const limit = Number(req.query.limit ?? 100)
  const offset = Number(req.query.offset ?? 0)
  const data = {limit, offset}
  return useApiHandler(res,
    '/users',
    PrismaUser.allUsersQuery(data)
)}

export default request