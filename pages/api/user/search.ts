import useApiHandler from "hooks/useApiHandler"
import { FollowerTypes, PrismaUser, UserSearchProps, UserTypes } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'
import {getSession} from "next-auth/react"

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const {id, search, followerTypes, userTypes, agg} = req.body ?? req.query
  return useApiHandler(
    res,
    'user/search',
    PrismaUser.search({id, search, followerTypes, userTypes, agg})
  )
}
export default request