import useApiHandler from "hooks/useApiHandler"
import {NextApiRequest,NextApiResponse} from 'next'
import {ArticleEngageProps,PrismaArticle} from "prisma/prismaContext"

const request = (req:NextApiRequest, res: NextApiResponse) => useApiHandler(res,'api/article/share', PrismaArticle.shareArticle(req.body as ArticleEngageProps)) //PrismaPost.sharePost(req.body as PostEngageProps))
export default request
