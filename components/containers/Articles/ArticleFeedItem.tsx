import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import {Article, ArticleType} from 'prisma/prismaContext'
import HtmlContent from 'components/ui/htmlContent'
import {cloudinary} from 'utils/cloudinary'

const ArticleFeedItem = ({article}:{article: Article}) => {
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
    <Card sx={{ minWidth: 300, maxWidth: 345, maxHeight: 700, minHeight: 300 }}>
      <CardMedia
        sx={{ minHeight: 200 }}
        image={cloudinary.scale({
          url: article.banner ?? bg.find((b) => b.type === article.type)!.image,
          height: 245,
        })}
      />
      <CardContent aria-rowcount={12}>
        <Typography gutterBottom variant="h5" component="div">
          {article.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <div className="max-h-min h-56 overflow-clip text-ellipsis border-b border-b-neutral border-opacity-50">
            <HtmlContent content={article.content} />
          </div>
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  )
}

export default ArticleFeedItem
