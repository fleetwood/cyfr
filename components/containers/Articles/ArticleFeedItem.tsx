import {CardActionArea} from '@mui/material'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import {useToast} from 'components/context/ToastContextProvider'
import AvatarPill from 'components/ui/avatar/avatarPill'
import HtmlContent from 'components/ui/htmlContent'
import useDebug from 'hooks/useDebug'
import {useRouter} from 'next/router'
import {ArticleStub} from 'prisma/prismaContext'
import useApi from 'prisma/useApi'
import {cloudinary} from 'utils/cloudinary'
import {defaultBanners, timeDifference} from 'utils/helpers'
import ArticleFooter from './ArticleFooter'

const {debug} = useDebug('containers/Articles/ArticleFeedItem')

const ArticleFeedItem = ({article, invalidate}:{article: ArticleStub, invalidate?: () => void}) => {
  const { cyfrUser, isLoading } = useApi.cyfrUser()
  const { notify, notifyLoginRequired } = useToast()
  const go = useRouter().push
  

  const isLoggedIn = () => {
    if (!cyfrUser) {
      notifyLoginRequired()
      return false
    }
    return true
  }

  const handleComment = async () => {
    if (!isLoggedIn()) return
    debug(`handleComment`)
  }

  return (
    <Card sx={{ maxWidth: 345, maxHeight: 650 }}>
      <CardActionArea onClick={() => go(`/articles/${article.slug}`)}>
        <CardMedia
          sx={{ height: 245 }}
          image={cloudinary.scale({
            url: article.banner ?? defaultBanners(article.type??'Article').image,
            height: 245,
          })}
        />
      </CardActionArea>
      <CardContent>
        <Typography gutterBottom component="div" className="relative flex">
          <AvatarPill user={article.creator} direction="left" variant={[]} />
        </Typography>
        <CardActionArea onClick={() => go(`/articles/${article.slug}`)}>
          <Typography
            gutterBottom
            component="div"
            className="border-b border-neutral border-opacity-20 py-2"
          >
            <div className="text-sm">
              Posted {timeDifference(article.updatedAt)}
            </div>
            <h3>{article.title}</h3>
          </Typography>
          <Typography>
            <div className="overflow-clip text-ellipsis pt-2">
              <HtmlContent content={article.hook!} />
            </div>
          </Typography>
        </CardActionArea>
      </CardContent>
      <CardActions>
        <ArticleFooter article={article} invalidate={invalidate} />
      </CardActions>
    </Card>
  )
}

export default ArticleFeedItem
