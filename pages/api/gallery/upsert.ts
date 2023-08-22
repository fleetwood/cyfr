import useApiHandler from "hooks/useApiHandler"
import { PrismaGallery } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => {
  const { galleryId, creatorId, title, description, images, files } = req.body

  return useApiHandler(res,
    'api/gallery/upsert',
    PrismaGallery.upsertGallery({ galleryId, creatorId, title, description, images, files })
)}

export default request