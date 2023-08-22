import useApiHandler from "hooks/useApiHandler"
import {NextApiRequest,NextApiResponse} from 'next'
import {ArticleEngageProps,PrismaArticle} from "prisma/prismaContext"

const request = (req:NextApiRequest, res: NextApiResponse) => useApiHandler(res,'api/article/like',PrismaArticle.likeArticle(req.body as ArticleEngageProps))
export default request
