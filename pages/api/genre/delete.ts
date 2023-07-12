import useApiHandler from "hooks/useApiHandler"
import { PrismaGenre } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => {
  const { title } = req.body

  return useApiHandler(res,
    '/api/genre/delete',
    PrismaGenre.deleteGenre({title})
)}

export default request