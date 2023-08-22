import useApiHandler from 'hooks/useApiHandler'
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaBook } from 'prisma/prismaContext'

const request = async (req:NextApiRequest, res: NextApiResponse) => {
    const { title } = req.query
    return useApiHandler(res, '/api/book/unique/title', 
    PrismaBook.isTitleUnique((title!).toString())
)}
export default request
