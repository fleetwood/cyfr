import useApiHandler from 'hooks/useApiHandler'
import { NextApiRequest, NextApiResponse } from 'next'
import { BookUpsertProps, PrismaBook } from 'prisma/prismaContext'

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const p: BookUpsertProps = req.body

  return useApiHandler(res,
    'api/book/upsert',
    PrismaBook.upsert(p)
  )
}
export default request
