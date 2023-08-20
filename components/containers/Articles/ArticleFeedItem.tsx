import {Tooltip} from '@mui/material'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import {useToast} from 'components/context/ToastContextProvider'
import AvatarPill from 'components/ui/avatar/avatarPill'
import HtmlContent from 'components/ui/htmlContent'
import {HeartIcon,MuiArticleIcon,ShareIcon} from 'components/ui/icons'
import ShrinkableIconButton from 'components/ui/shrinkableIconButton'
import useDebug from 'hooks/useDebug'
import {ArticleStub,ArticleType} from 'prisma/prismaContext'
import useApi from 'prisma/useApi'
import {cloudinary} from 'utils/cloudinary'
import {abbrNum,timeDifference} from 'utils/helpers'
import ArticleFooter from './ArticleFooter'

const {debug} = useDebug('containers/Articles/ArticleFeedItem')

const ArticleFeedItem = ({article, invalidate}:{article: ArticleStub, invalidate?: () => void}) => {
  const { cyfrUser, isLoading } = useApi.cyfrUser()
  const { notify, notifyLoginRequired } = useToast()
  const bg:{type: ArticleType, image: string}[] = [
    {
      type: 'Article',
      image: 'https://res.cloudinary.com/drckf8gfc/image/upload/v1692405154/CyfrArticles_frzr17.png'
    },
    { 
      type: 'Review',
      image: 'https://res.cloudinary.com/drckf8gfc/image/upload/v1692405154/CyfrReviews_mmqdjo.png'
    },
    { 
      type: 'News', 
      image: 'https://res.cloudinary.com/drckf8gfc/image/upload/v1692400755/cyfr/CyfrNews_vx7n37.png'
    },
    { 
      type: 'Knowledge',
      image: 'https://res.cloudinary.com/drckf8gfc/image/upload/v1692400755/cyfr/CyfrLearn_sue08m.png'
    }
  ]

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
      <CardMedia
        sx={{ height: 245 }}
        image={cloudinary.scale({
          url: article.banner ?? bg.find((b) => b.type === article.type)!.image,
          height: 245,
        })}
      />
      <CardContent>
        <Typography gutterBottom component="div" className="relative flex">
          <AvatarPill user={article.creator} direction="left" variant={[]} />
        </Typography>
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
      </CardContent>
      <CardActions>
        <ArticleFooter article={article} invalidate={invalidate} />
      </CardActions>
    </Card>
  )
}

export default ArticleFeedItem
