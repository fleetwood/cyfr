import useApiHandler from "hooks/useApiHandler"
import { NextApiRequest, NextApiResponse } from "next"
import { PrismaBook } from "prisma/prismaContext"

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  // TODO Unlike/Unfan
  const { body } = req
  const { bookId, creatorId } = body
  
  return useApiHandler(res,
    'api/book/like',
    PrismaBook.like({bookId, creatorId})
)}
export default request
