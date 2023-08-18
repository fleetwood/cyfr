import useApiHandler from 'hooks/useApiHandler'
import {NextApiRequest,NextApiResponse} from 'next'
import {PrismaArticle} from 'prisma/prismaContext'

const request = async (req: NextApiRequest, res: NextApiResponse) => {
  const {t}  = req.query

  return useApiHandler(res, 'api/articles/feed', PrismaArticle.feed({t: t?.toString()}))
}

export default request
