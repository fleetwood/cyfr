import { PostStub } from 'prisma/prismaContext'

import HtmlContent from 'components/ui/htmlContent'
import useDebug from 'hooks/useDebug'
import PostCommentThread from '../Comment/PostCommentThread'
import GalleryPhotoswipe from '../Gallery/GalleryImages'
import SharedPostStubView from '../Share/ShareStubView'

const { debug, jsonBlock } = useDebug('PostStubView',)

type PostFeedItemProps = {
  post: PostStub
}

const PostStubView = ({ post }: PostFeedItemProps) => {
  const comments: any[] = []

  return (
    <div>
      {post.content && <HtmlContent content={post.content} className="font-feed" />}

      {post.images && post.images[0] && <GalleryPhotoswipe images={post.images} />}

      {post.share && <SharedPostStubView share={post.share} />}

      {post.commentThread && <PostCommentThread postStub={post} /> }
    </div>
  )
}

export default PostStubView
