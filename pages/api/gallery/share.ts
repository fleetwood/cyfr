import useApiHandler from "hooks/useApiHandler"
import { GalleryEngageProps, PrismaGallery } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'
import useDebug from "hooks/useDebug"
const {debug} = useDebug('api/gallery/share', 'DEBUG')

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const props:GalleryEngageProps = req.body as GalleryEngageProps
  debug('request', props)

  return useApiHandler(res,
    'api/gallery/share',
    PrismaGallery.share(props),
    'DEBUG'
)}

export default request