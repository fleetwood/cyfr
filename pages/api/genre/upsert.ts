import useApiHandler from "hooks/useApiHandler"
import { PrismaGenre } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => {
  const { title, description, fiction } = req.body
  return useApiHandler(res,
    '/api/genre/details',
    PrismaGenre.upsertGenre({title, description, fiction})
)}

export default request
