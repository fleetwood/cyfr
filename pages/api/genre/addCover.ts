import useApiHandler from "hooks/useApiHandler"
import { GenreAddCoverProps, PrismaGenre } from "prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => {
  const { id, image } = req.body as GenreAddCoverProps

  return useApiHandler(res,
    'api/genre/addCover',
    PrismaGenre.addCover({id, image})
)}

export default request
