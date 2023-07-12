import useApiHandler from 'hooks/useApiHandler'
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaChapter } from 'prisma/prismaContext'

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const { currentChapters, changedChapter } = req.body

  return useApiHandler(res,
    'api/chapter/sort',
    PrismaChapter.sort(currentChapters, changedChapter)
  )
}
export default request
