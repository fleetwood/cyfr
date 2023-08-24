import useApiHandler from 'hooks/useApiHandler'
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaChapter } from 'prisma/prismaContext'

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body

  return useApiHandler(res,
    'api/chapter/stub',
    PrismaChapter.stub(id)
  )
}
export default request
