import useApiHandler from "hooks/useApiHandler"
import { PrismaGenre } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => useApiHandler(res,'/api/genre/stubs',PrismaGenre.stubs())
export default request