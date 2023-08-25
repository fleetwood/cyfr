import useApiHandler from "hooks/useApiHandler"
import { PrismaUser } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'
import useApi from "prisma/useApi"

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const { typeId, cadence } = req.body
  const {cyfrUser} = useApi.cyfrUser()

  return useApiHandler(res,
    'api/user/membership/choose',
    PrismaUser.setMembership(cyfrUser, typeId, cadence)
)}
export default request
