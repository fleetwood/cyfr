import useApiHandler from 'hooks/useApiHandler'
import { PrismaCover } from 'prisma/prismaContext'
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => {
  const {genre} = req.query
  return useApiHandler(res,
  'api/cover/findCover',
  PrismaCover.findCover(genre?.toString())
)}

export default request
