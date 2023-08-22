import useApiHandler from 'hooks/useApiHandler'
import { PrismaChapter } from 'prisma/entities'
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => {
  const { chapter } = req.body
  return useApiHandler(res,
    'api/chapter/upsert',
    PrismaChapter.upsert(chapter)
  )
}
export default request