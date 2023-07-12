import useApiHandler from "hooks/useApiHandler"
import { ImageUpsertProps, PrismaImage } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => useApiHandler(res,
    'api/image/upsert',
    PrismaImage.upsert(req.body as ImageUpsertProps)
)
export default request
