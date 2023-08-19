import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import AvatarPill from 'components/ui/avatar/avatarPill'
import UserAvatar from 'components/ui/avatar/userAvatar'
import HtmlContent from 'components/ui/htmlContent'
import {ArticleStub,ArticleType} from 'prisma/prismaContext'
import {cloudinary} from 'utils/cloudinary'
import {timeDifference} from 'utils/helpers'

const ArticleFeedItem = ({article}:{article: ArticleStub}) => {
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
          <AvatarPill user={article.creator} direction='left' variant={[]} />
        </Typography>
        <Typography gutterBottom component="div" className='border-b border-neutral border-opacity-20 py-2'>
          <div className='text-sm'>Posted {timeDifference(article.updatedAt)}</div>
          <h3>{article.title}</h3>
        </Typography>
        <Typography>
          <div className="overflow-clip text-ellipsis pt-2">
            <HtmlContent content={article.hook!} />
          </div>
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Read</Button>
      </CardActions>
    </Card>
  )
}

export default ArticleFeedItem
