import {
  Article,
  ArticleEngageProps,
  ArticleQueryProps,
  ArticleStub,
  ArticleType,
} from 'prisma/prismaContext'
import useDebug from 'hooks/useDebug'
import { NotImplemented, getApi, sendApi } from 'utils/api'

const { debug, fileMethod } = useDebug('hooks/useArticleApi')
const noArticleDetail = (method: string) => {
  debug(method, 'articleDetail is null')
  return false
}

const useArticleApi = () => {
  const query = ({ articleId, articleSlug }: ArticleQueryProps) =>
    articleId ? detailById(articleId) : detailBySlug(articleSlug!)

  const detailById = (id: string): Article => {
    throw NotImplemented()
  }
  const detailBySlug = (slug: string): Article => {
    throw NotImplemented()
  }

  const share = async (props: ArticleEngageProps): Promise<boolean> =>
    await (
      await sendApi('article/share', props)
    ).data

  const like = async (props: ArticleEngageProps): Promise<boolean> =>
    await (
      await sendApi('article/like', props)
    ).data

  const comment = async (props: ArticleEngageProps): Promise<boolean> =>
    await (
      await sendApi('article/comment', props)
    ).data

  const feed = async ({
    type,
    take = 10,
    skip = 0,
  }: {
    type?: ArticleType
    take?: number
    skip?: number
  }): Promise<ArticleStub[]> =>
    await getApi(`article/feed${type ? `?t=` + type : ''}`)

  return {
    comment,
    detailById,
    detailBySlug,
    feed,
    like,
    share,
    query,
  }
}
export default useArticleApi
