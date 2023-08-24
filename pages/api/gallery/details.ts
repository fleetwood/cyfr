import useApiHandler from "hooks/useApiHandler"
import { PrismaGallery } from "prisma/entities"
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => useApiHandler(res,'api/gallery/details',PrismaGallery.details())
export default request
