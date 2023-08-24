import useApiHandler from 'hooks/useApiHandler'
import {NextApiRequest,NextApiResponse} from 'next'
import {PrismaArticle} from 'prisma/prismaContext'

const request = (req:NextApiRequest, res: NextApiResponse) => {
  const { articleId, creatorId, content } = req.body

  return useApiHandler(res,
    'api/article/comment',
    PrismaArticle.commentOnArticle({articleId, creatorId, content})
)}

export default request