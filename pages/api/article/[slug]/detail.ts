import useApiHandler from 'hooks/useApiHandler'
import {NextApiRequest,NextApiResponse} from 'next'
import {PrismaArticle} from 'prisma/prismaContext'

const request = (req: NextApiRequest, res: NextApiResponse) =>
  useApiHandler(
    res,
    'api/article/[slug]/detail',
    PrismaArticle.detailBySlug(req.query.slug!.toString())
  )

export default request
