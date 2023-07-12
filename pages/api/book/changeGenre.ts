import useApiHandler from "hooks/useApiHandler"
import { NextApiRequest, NextApiResponse } from "next"
import { ChangeGenreProps, PrismaBook } from "prisma/prismaContext"

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const { bookId, genreId } = req.body as ChangeGenreProps
  
  return useApiHandler(res,
    'api/book/changeGenre',
    PrismaBook.changeGenre({bookId, genreId})
)}
export default request