import useApiHandler from 'hooks/useApiHandler'
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaChapter } from 'prisma/prismaContext'

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const { chapterId } = req.body

  return useApiHandler(res,
    'api/chapter/detail',
    PrismaChapter.detail(chapterId)
  )
}
export default request
