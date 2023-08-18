
import useDebug from "hooks/useDebug"
import {ArticleType, prisma} from "prisma/prismaContext"
import {PaginationProps} from "types/props"
import {capFirstLetter} from "utils/helpers"
const {debug, err, info, fileMethod} = useDebug('entities/prismaArticle')

type ArticleFeedProps = PaginationProps & {
  type?: ArticleType
}
const feed = async ({type, take=10, skip=0}:ArticleFeedProps): Promise<any[]> => {
  debug('feed', {})
  try {
    return await prisma.article.findMany({
      //TODO: blocked users
      where: {
        visible: true,
        type
      },
      orderBy: {createdAt: "desc"},
      //TODO: pagination
      take, skip
    })
  } catch (error) {
    info('prismaArticle.feed ERROR',{error})
    throw error
  }
}


export const PrismaArticle = { feed }
