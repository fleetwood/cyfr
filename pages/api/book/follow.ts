import useApiHandler from "hooks/useApiHandler"
import { NextApiRequest, NextApiResponse } from "next"
import { PrismaBook } from "prisma/prismaContext"

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  // TODO Unfollow/Unfan
  const {body} = req
  const { bookId, followerId, isFan = false } = body
  
  return useApiHandler(res,
    'api/book/follow',
    PrismaBook.follow({bookId, followerId, isFan})
)}
export default request