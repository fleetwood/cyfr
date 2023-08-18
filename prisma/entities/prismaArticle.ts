
import useDebug from "hooks/useDebug"
import {prisma} from "prisma/prismaContext"
import {PaginationProps} from "types/props"
const {debug, err, info, fileMethod} = useDebug('entities/prismaArticle')

type ArticleFeedProps = PaginationProps & {
  t?: string
}
const feed = async ({t, take=10, skip=0}:ArticleFeedProps): Promise<any[]> => {
  debug('feed', {})
  try {
    return await prisma.article.findMany({
      //TODO: blocked users
      where: {visible: true},
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
