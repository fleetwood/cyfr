import ArticleLayout from 'components/layouts/ArticleLayout'
import useUrlHash from 'hooks/useUrlHash'

const ArticlePage = (_props: any) => {
  const tag = useUrlHash('all')
  return (
    <ArticleLayout hash={tag}>
      {(tag === 'all' || tag === '')  && (
        <>
          <h3>Articles</h3>
        </>
      )}
      {tag === 'news' && (
        <>
          <h3>News</h3>
        </>
      )}
      {tag === 'reviews' && (
        <>
          <h3>Reviews</h3>
        </>
      )}
      {tag === 'learn' && (
        <>
          <h3>Learn</h3>
        </>
      )}
    </ArticleLayout>
  )
}

ArticlePage.propTypes = {}

export default ArticlePage