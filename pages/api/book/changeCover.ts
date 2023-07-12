import useApiHandler from "hooks/useApiHandler"
import { NextApiRequest, NextApiResponse } from "next"
import { ChangeCoverProps, PrismaBook } from "prisma/prismaContext"

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const { book, newImage, cover, imageId } = req.body as ChangeCoverProps
  
  return useApiHandler(res,
    'api/book/changeCover',
    PrismaBook.changeCover({book, newImage, cover, imageId})
)}
export default request
