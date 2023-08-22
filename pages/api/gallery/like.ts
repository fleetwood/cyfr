import useApiHandler from "hooks/useApiHandler"
import { GalleryEngageProps, PrismaGallery } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => {
  const { galleryId, creatorId } = req.body as GalleryEngageProps

  return useApiHandler(res,
    'api/gallery/like',
    PrismaGallery.like({galleryId, creatorId})
)}

export default request