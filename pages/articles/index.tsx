import {Grid} from '@mui/material'
import {Article, ArticleType} from '@prisma/client'
import ArticleFeedItem from 'components/containers/Articles/ArticleFeedItem'
import ArticleLayout from 'components/layouts/ArticleLayout'
import useDebug from 'hooks/useDebug'
import useUrlHash from 'hooks/useUrlHash'
import useApi from 'prisma/useApi'
import {useEffect, useState} from 'react'

const {debug} = useDebug('page/articles', 'DEBUG')

const ArticlePage = (_props: any) => {
  const {feed} = useApi.article()
  const tag = useUrlHash('all')

  const isArticles = tag === 'all' || tag === ''
  const isNews = tag === 'news'
  const isReviews = tag === 'reviews'
  const isLearn = tag === 'learn'

  const [articles, setArticles] = useState<Article[]>([])

  const updateArticles = async () => {
    const type:ArticleType|undefined = isNews ? 'News' : isLearn ? 'Knowledge' : isReviews ? 'Review' : undefined
    const result = await feed({type})
    if (result) {
      debug('Got articles ya', {result})
      setArticles(() => result)
    } else {
      debug('did got none results')
    }
  }

  useEffect(() => {
    updateArticles()
  }, [tag])

  return (
    <ArticleLayout hash={tag}>
      <Grid container columnGap={2} rowGap={2}>

      {articles.map((a:Article) => (
        <ArticleFeedItem article={a} />
        ))}
      </Grid>
    </ArticleLayout>
  )
}

export default ArticlePage