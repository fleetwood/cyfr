import useApiHandler from "hooks/useApiHandler"
import { FollowerTypes, PrismaUser, UserSearchProps, UserTypes } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  // pages/api/user/[slug]/friends.ts
  // user/search?s=${props.search ?? ''}&f=${(props.followerTypes ?? []).join(',')}&u=${(props.userTypes ?? []).join(',')}}
  const cyfrUser = await PrismaUser.userInSessionReq(req)

  const {s, f, u, agg} = req.query
  const props:UserSearchProps = {
    id: cyfrUser!.id,
    search: s?.toString()??'',
    followerTypes: ((f && f.toString().split(',')) as unknown as FollowerTypes[]),
    userTypes: ((u && u.toString().split(',')) as unknown as UserTypes[]),
    agg: (agg !== undefined)
  }
  return useApiHandler(
    res,
    'user/search',
    PrismaUser.search(props)
  )
}
export default request