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

const {debug} = useDebug('containers/Articles/ArticleFeedItem')

const ArticleFeedItem = ({article, invalidate}:{article: ArticleStub, invalidate?: () => void}) => {
  const { cyfrUser, isLoading } = useApi.cyfrUser()
  const {like, share, comment} = useApi.article()
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

  const handleLike = async () => {
    if (!isLoggedIn()) return

    debug(`handleLike`)
    const liked = await like({ articleId: article.id, creatorId: cyfrUser!.id })
    if (liked) {
      notify('You liked this article!!!!!!!!!!!', 'success')
      invalidate && invalidate()
      return
    }
    notify("Well that didn't work...", 'warning')
  }

  const handleShare = async () => {
    if (!isLoggedIn()) return

    debug(`handleShare`)
    const shared = await share({ articleId: article.id, creatorId: cyfrUser!.id })
    if (shared) {
      notify('You shared this articles', 'success')
      invalidate && invalidate()
      return
    }
    notify("Well that didn't work...", 'warning')
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
        <div className="flex flex-row justify-around py-4">
          <Tooltip title="Article">
            <MuiArticleIcon />
          </Tooltip>
          <div>
            <ShrinkableIconButton
              icon={HeartIcon}
              className="bg-opacity-0 hover:shadow-none"
              iconClassName="text-primary"
              labelClassName="text-primary"
              label={`Like (${abbrNum(article._count.likes)})`}
              onClick={() => handleLike()}
            />
            {/* @ts-ignore */}
            {/* {article.likes && (
              <UserAvatarList
                users={article.likes.map((like) => like.creator)}
                count={article.likes.length}
                sz="sm"
              />
            )} */}
          </div>

          <div>
            <ShrinkableIconButton
              icon={ShareIcon}
              className="bg-opacity-0 hover:shadow-none"
              iconClassName="text-primary"
              labelClassName="text-primary"
              label={`Shares (${abbrNum(article._count.shares)})`}
              onClick={() => handleShare()}
            />
            {/* {article.shares && (
              <UserAvatarList
                users={article.shares.map((share) => share.creator)}
                sz="sm"
                count={article.shares.length}
              />
            )} */}
          </div>

          <div>
            {/* <CreateCommentFooterButton
              articleId={article.id}
              comments={(article.commentThread?.comments ?? []).length}
            /> */}
            {/* {article.commentThread?.comments && (
              <UserAvatarList
                users={article.commentThread.comments.map(
                  (comment) => comment.creator
                )}
                sz="sm"
                count={article.commentThread.comments.length}
              />
            )} */}
          </div>
        </div>
      </CardActions>
    </Card>
  )
}

export default ArticleFeedItem
