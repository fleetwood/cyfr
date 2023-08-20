
import useDebug from "hooks/useDebug"
import {Article,ArticleCommentProps,ArticleDetail,ArticleDetailInclude,ArticleEngageProps,ArticleStub,ArticleStubInclude,ArticleType,Like,Share,prisma} from "prisma/prismaContext"
import {PaginationProps} from "types/props"
import {NotImplemented} from "utils/api"
const {debug, err, info, fileMethod} = useDebug('entities/prismaArticle')

type ArticleFeedProps = PaginationProps & {
  type?: ArticleType
}
const feed = async ({type, take=10, skip=0}:ArticleFeedProps): Promise<ArticleStub[]> => {
  debug('feed', {})
  try {
    return await prisma.article.findMany({
      //TODO: blocked users
      where: {
        visible: true,
        type,
      },
      orderBy: { createdAt: 'desc' },
      include: ArticleStubInclude
    }) as unknown as ArticleStub[]
  } catch (error) {
    info('prismaArticle.feed ERROR',{error})
    throw error
  }
}

const detailById = async (articleId:string):Promise<ArticleDetail> => {
  debug('detailById', {})
  try {
    return await prisma.article.findMany({
      //TODO: blocked users
      where: {
        id: articleId,
      },
      include: ArticleDetailInclude,
    }) as unknown as ArticleDetail
  } catch (error) {
    info('prismaArticle.feed ERROR', { error })
    throw error
  }
}

const likeArticle = async ({articleId,creatorId,}: ArticleEngageProps): Promise<Like> => {
  try {
    debug('likeArticle', { articleId, creatorId })
    return await prisma.like.create({
      data: { articleId, creatorId },
    })
  } catch (error) {
    info('likeArticle ERROR: ', { error, articleId, creatorId })
    throw { code: fileMethod('likeArticle'), ...{ error } }
  }
}

/**
 * Params {@link ArticleEngageProps}
 * @param articleId: String
 * @param creatorId: String
 * @returns: {@link Article}
 */
const shareArticle = async ({articleId,creatorId,}: ArticleEngageProps): Promise<Share> => {
  debug(`share`, { articleId, creatorId })
  try {
    throw NotImplemented('shareArticle')
  } catch (error) {
    info('shareArticle ERROR: ', { error, articleId, creatorId })
    throw { code: fileMethod('shareArticle'), ...{ error } }
  }
}

const commentOnArticle = async (props: ArticleCommentProps): Promise<ArticleDetail> => {
  const { articleId, creatorId, content } = props
  try {
    debug('commentOnArticle', { ...props })
    const article = await prisma.article.findFirst({
      where: { id: articleId },
      include: {
        commentThread: {
          include: {
            comments: true,
          },
        },
      },
    })
    if (article) {
      if (article.commentThreadId !== undefined) {
        const thread = await prisma.commentThread.update({
          where: { id: article.commentThreadId! },
          data: {
            comments: {
              create: {
                content,
                creatorId,
              },
            },
          },
        })
        if (thread) return detailById(articleId!)
      } else {
        const thread = await prisma.commentThread.create({
          data: {
            article: {
              connect: { id: article.id },
            },
            comments: {
              create: {
                content,
                creatorId,
              },
            },
          },
        })
        if (thread) return detailById(articleId!)
      }
    }
    throw { message: 'Unable to comment on article' }
  } catch (error) {
    info('commentOnArticle ERROR: ', error)
    throw { code: fileMethod('commentOnArticle'), message: 'Article not commented!' }
  }
}

export const PrismaArticle = { feed, commentOnArticle, likeArticle, shareArticle }
