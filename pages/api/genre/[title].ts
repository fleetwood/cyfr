import useApiHandler from "hooks/useApiHandler"
import { PrismaGenre } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => {
  const { title } = req.query

  return useApiHandler(res,
    '/api/genre/[title]',
    PrismaGenre.detail(title?.toString() || "")
)}

export default request