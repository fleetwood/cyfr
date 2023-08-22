import useApiHandler from 'hooks/useApiHandler'
import { ImageUpsertProps, PrismaImage } from 'prisma/prismaContext'
import { NextApiRequest, NextApiResponse } from 'next'
import useDebug from 'hooks/useDebug'

const { debug } = useDebug('api/image')

const request = (req: NextApiRequest, res: NextApiResponse) => {
  const {
    creatorId,
    url,
    visible,
    height,
    width,
    title,
    galleryId,
    postId,
    commentThreadId,
  } = req.body

  return useApiHandler(
    res,
    'api/image/upsert',
    PrismaImage.upsert({creatorId,url,visible,height,width,title,galleryId,postId,commentThreadId})
)}
export default request
