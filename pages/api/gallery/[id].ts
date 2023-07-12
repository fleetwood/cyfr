import useApiHandler from "hooks/useApiHandler"
import { PrismaGallery } from "prisma/entities"
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id?.toString() || ""

  return useApiHandler(res,
    'api/gallery/[id]',
    PrismaGallery.detail(id)
)}

export default request