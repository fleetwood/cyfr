import useApiHandler from "hooks/useApiHandler"
import { NextApiRequest, NextApiResponse } from 'next'
import { ImageEngageProps, PrismaImage } from "prisma/prismaContext"

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const props:ImageEngageProps = req.body as ImageEngageProps

  return useApiHandler(res,
    'api/image/share',
    PrismaImage.share(props)
)}

export default request