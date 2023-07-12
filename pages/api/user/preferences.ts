import useApiHandler from "hooks/useApiHandler"
import { PrismaUser } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const { id, name, image } = req.body
  
  return useApiHandler(res,
    'api/user/preferences',
    PrismaUser.updatePreferences({id, name, image})
)}
export default request