import ArticleLayout from 'components/layouts/ArticleLayout'
import useUrlHash from 'hooks/useUrlHash'
import {useEffect, useState} from 'react'

const ArticlePage = (_props: any) => {
  const tag = useUrlHash('all')

  const isArticles = tag === 'all' || tag === ''
  const isNews = tag === 'news'
  const isReviews = tag === 'reviews'
  const isLearn = tag === 'learn'

  const [articles, setArticles] = useState()
  const [news, setNews] = useState()
  const [reviews, setReviews] = useState()
  const [learn, setLearn] = useState()

  useEffect(() => {
    if (isArticles) {}
    if (isNews) {}
    if (isReviews) {}
    if (isLearn) {}
  }, [tag])

  return (
    <ArticleLayout hash={tag}>
      {isArticles  && (
        <>
          <h3>Articles</h3>
        </>
      )}
      {isNews && (
        <>
          <h3>News</h3>
        </>
      )}
      {isReviews && (
        <>
          <h3>Reviews</h3>
        </>
      )}
      {isLearn && (
        <>
          <h3>Learn</h3>
        </>
      )}
    </ArticleLayout>
  )
}

ArticlePage.propTypes = {}

export default ArticlePage