import useApiHandler from "hooks/useApiHandler"
import { PrismaUser } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = async (req:NextApiRequest, res: NextApiResponse) => useApiHandler(res,
    'api/me',
    PrismaUser.userInSessionReq(req)
)
export default request