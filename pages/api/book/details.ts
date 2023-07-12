import useApiHandler from "hooks/useApiHandler"
import { NextApiRequest, NextApiResponse } from "next"
import { PrismaBook } from "prisma/prismaContext"

const request = async (req:NextApiRequest, res: NextApiResponse) => 
  useApiHandler(res,
    '/api/book/details',
    PrismaBook.details()
  )
export default request