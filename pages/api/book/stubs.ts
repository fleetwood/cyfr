import useApiHandler from 'hooks/useApiHandler'
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaBook } from 'prisma/prismaContext'

const request = async (req:NextApiRequest, res: NextApiResponse) => useApiHandler(res, '/api/book/stubs', PrismaBook.stubs())
export default request
