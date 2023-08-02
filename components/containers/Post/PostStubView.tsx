import { PostStub } from 'prisma/prismaContext'

import HtmlContent from 'components/ui/htmlContent'
import useDebug from 'hooks/useDebug'
import PostCommentThread from '../Comment/PostCommentThread'
import GalleryPhotoswipe from '../Gallery/GalleryImages'
import SharedPostStubView from '../Share/ShareStubView'
import { Grid } from '@mui/material'

const { debug, jsonBlock } = useDebug('PostStubView',)

type PostFeedItemProps = {
  post: PostStub
}

const PostStubView = ({ post }: PostFeedItemProps) => (
  <Grid container rowGap={2}>
    <div className='p-2 min-w-full'>
      {post.content && <HtmlContent content={post.content} className="font-feed" />}

      {post.images && post.images[0] && <GalleryPhotoswipe images={post.images} />}

      {post.share && <SharedPostStubView share={post.share} />}
    </div>
    
    {post.commentThread && 
      <div className='border border-neutral border-opacity-50 rounded-md p-2 m-2 min-w-fit'>
        <PostCommentThread postStub={post} /> 
      </div>
    }
  </Grid>
)
export default PostStubView
