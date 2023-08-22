import useApiHandler from "hooks/useApiHandler"
import { GalleryEngageProps, PrismaGallery } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const props:GalleryEngageProps = req.body as GalleryEngageProps

  return useApiHandler(res,
    'api/gallery/share',
    PrismaGallery.share(props)
)}

export default request