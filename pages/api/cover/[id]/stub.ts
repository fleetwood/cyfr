import useApiHandler from 'hooks/useApiHandler'
import { PrismaCover } from 'prisma/prismaContext'
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  return useApiHandler(
    res,
    `api/cover/[${id}]/stub`,
    PrismaCover.stub(id!.toString())
  )
}

export default request
