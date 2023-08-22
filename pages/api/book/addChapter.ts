import useApiHandler from "hooks/useApiHandler"
import { NextApiRequest, NextApiResponse } from "next"
import { PrismaBook } from "prisma/prismaContext"

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const { bookId, title, order } = req.body
  return useApiHandler(res,
    "api/book/addChapter",
    PrismaBook.addChapter({ bookId, title, order })
)}

export default request