import { PostStub } from 'prisma/prismaContext'

import HtmlContent from 'components/ui/htmlContent'
import useDebug from 'hooks/useDebug'
import PostCommentThread from '../Comment/PostCommentThread'
import GalleryPhotoswipe from '../Gallery/GalleryImages'
import SharedPostStubView from '../Share/ShareStubView'
import { Grid } from '@mui/material'
import MuiGallery from '../Gallery/MuiGallery'
import GalleryImages from '../Gallery/GalleryImages'

const { debug, jsonBlock } = useDebug('PostStubView',)

type PostFeedItemProps = {
  post:        PostStub
  invalidate?: () => void
}

const PostStubView = ({ post, invalidate }: PostFeedItemProps) => (
  <Grid container rowGap={2}>
    <div className='p-2 min-w-full'>
      {post.content && <HtmlContent content={post.content} className="font-feed" />}

      {post.images && post.images[0] && <GalleryImages images={post.images} />}

      {post.share && <SharedPostStubView share={post.share} />}
    </div>
    
    {post.commentThread && 
      <div className='border border-neutral border-opacity-50 rounded-md p-2 m-2 grow'>
        <PostCommentThread postStub={post} /> 
      </div>
    }
  </Grid>
)
export default PostStubView
