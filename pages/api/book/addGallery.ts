import useApiHandler from "hooks/useApiHandler"
import { NextApiRequest, NextApiResponse } from "next"
import { PrismaBook } from "prisma/prismaContext"

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const { galleryId, bookId } = req.body
  
  return useApiHandler(res,
    'api/book/addGallery',
    PrismaBook.addGallery({galleryId, bookId})
)}
export default request