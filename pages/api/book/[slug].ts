import useApiHandler from "hooks/useApiHandler"
import useDebug from "hooks/useDebug"
import {NextApiRequest,NextApiResponse} from "next"
import {PrismaBook} from "prisma/prismaContext"

const {debug} = useDebug('/api/book/[slug]', 'DEBUG')

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const {slug} = req.query
  debug('api/book/slug', slug)
  return useApiHandler(res,
  `/api/book/[slug]`,
  PrismaBook.detail(slug!.toString())
)}

export default request