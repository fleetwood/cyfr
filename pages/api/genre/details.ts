import useApiHandler from "hooks/useApiHandler"
import { PrismaGenre } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => useApiHandler(res,'/api/genre/details',PrismaGenre.details())
export default request