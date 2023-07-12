import { SharedPostStub } from 'prisma/prismaContext'

import HtmlContent from 'components/ui/htmlContent'
import useDebug from 'hooks/useDebug'
import GalleryPhotoswipe from '../Gallery/GalleryPhotoswipe'

const { debug, jsonBlock } = useDebug('SharedPostStubView','DEBUG')

type SharedPostFeedItemProps = {
  post: SharedPostStub
}

const SharedPostStubView = ({ post }: SharedPostFeedItemProps) => {
  const comments: any[] = []

  return post ? (
    <div className='bg-neutral bg-opacity-10 rounded-lg p-4'>
      {post.content && <HtmlContent content={post.content} className="font-feed" />}

      {post.images?.length > 0 && post.images[0] !== null && <GalleryPhotoswipe images={post.images} />}

      {/* {post.commentThread && <PostCommentThread postStub={post} /> } */}

    </div>
  ) : (
    <></>
  )
}

export default SharedPostStubView
