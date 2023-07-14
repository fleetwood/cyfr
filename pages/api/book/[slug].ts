import useApiHandler from "hooks/useApiHandler"
import useDebug from "hooks/useDebug"
import { NextApiRequest, NextApiResponse } from "next"
import { BookDetailInclude, PrismaBook } from "prisma/prismaContext"

const {debug} = useDebug('/api/book/[slug]', 'DEBUG')

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  debug('handle', {BookDetailInclude})
  return useApiHandler(res,
  `/api/book/[slug]`,
  PrismaBook.detail({slug: req.query.slug!.toString()})
)}

export default request