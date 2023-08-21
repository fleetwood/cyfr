import { Box, Button, Grid, IconButton, Typography } from '@mui/material'
import ArticleFooter from 'components/containers/Articles/ArticleFooter'
import CloudinaryImage from 'components/containers/Image/CloudinaryImage'
import ArticleLayout from 'components/layouts/ArticleLayout'
import UserAvatar from 'components/ui/avatar/userAvatar'
import HtmlContent from 'components/ui/htmlContent'
import { MuiArrowLeftIcon } from 'components/ui/icons'
import Spinner from 'components/ui/spinner'
import useDebug from 'hooks/useDebug'
import { useRouter } from 'next/router'
import ErrorPage from 'pages/404'
import useApi from 'prisma/useApi'
import { stringToColour } from 'types/props'
import { defaultBanners, timeDifference } from 'utils/helpers'
import { GetUserType } from 'utils/helpers/user'

const { debug, jsonBlock } = useDebug('page/articles')

export async function getServerSideProps(context: any) {
  const slug = context.params.slug

  return {
    props: {
      slug,
    },
  }
}

const ArticlePage = ({ slug }: { slug: string }) => {
  const {
    data: article,
    isLoading,
    invalidate,
    error,
  } = useApi.article().query({ slug })
  const user = article?.creator
  const route = useRouter().push

  const BackToArticles = () => (
    <Grid>
      <Button onClick={() => route('/articles')}>
        <MuiArrowLeftIcon /> Back to Articles
      </Button>
    </Grid>
  )

  return (
    <ArticleLayout>
      <BackToArticles />
      <Box>
        {isLoading && <Spinner />}
        {error && (
          <ErrorPage>
            <h3>Ya that dint work</h3>
            <div className="bg-red-500 text-base-100">
              <Typography>Could not load the article.</Typography>
              <Typography>id: {slug}</Typography>
            </div>
          </ErrorPage>
        )}
        {article && (
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Grid item xs>
              <h2 className="my-2">{article.title}</h2>
              <Grid container flexDirection="row">
                <Grid item xs={1}>
                  by
                </Grid>
                <Grid item xs>
                  <div className={`flex flex-row max-w-fit`}>
                    <IconButton sx={{ p: 0 }}>
                      <UserAvatar user={user} sz="xl" />
                    </IconButton>
                    <div className={`px-4 cursor-default`}>
                      <span className="font-semibold text-base-content">
                        {user.name}
                      </span>
                      <br />
                      <Typography
                        className="font-semibold"
                        sx={{
                          color: stringToColour(GetUserType(user)),
                        }}
                      >
                        {user.membership?.type.name}
                      </Typography>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs>
              <CloudinaryImage
                variants="banner"
                url={
                  article.banner ??
                  defaultBanners(article.type ?? 'Article').image
                }
              />
            </Grid>
            <Grid>{timeDifference(article.updatedAt)}</Grid>
            <Grid item xs>
              <HtmlContent className='my-2' content={article.content} />
            </Grid>
            <Grid>
              <ArticleFooter article={article} invalidate={invalidate} avatars={true} />
              <BackToArticles />
            </Grid>
          </Grid>
        )}
      </Box>
    </ArticleLayout>
  )
}

export default ArticlePage
