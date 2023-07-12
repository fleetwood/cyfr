import useApiHandler from 'hooks/useApiHandler'
import { NextApiRequest, NextApiResponse } from "next"
import { PrismaBook } from 'prisma/prismaContext'

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const { bookId, creatorId } = req.body
  return useApiHandler(res,
    'api/book/share',
    PrismaBook.share({ bookId, creatorId })
  )
}
export default request
