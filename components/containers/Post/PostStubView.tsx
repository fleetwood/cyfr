import { PostStub } from 'prisma/prismaContext'

import JsonBlock from 'components/ui/jsonBlock'
import HtmlContent from 'components/ui/htmlContent'
import GalleryPhotoswipe from '../Gallery/GalleryPhotoswipe'
import useDebug from 'hooks/useDebug'
import ImageStubView from '../Image/ImageStubView'
import BookStubView from '../Books/BookStubView'

const { debug, jsonBlock } = useDebug('PostStubView','DEBUG')

type PostFeedItemProps = {
  post: PostStub
}

const PostStubView = ({ post }: PostFeedItemProps) => {
  const comments: any[] = []

  return post ? (
    <div>
      {post.content && (
        <HtmlContent content={post.content} className="font-feed" />
      )}

      {post.images?.length > 0 && post.images[0] !== null && (
        <GalleryPhotoswipe images={post.images} />
      )}

      {post.post && <PostStubView post={post.post as PostStub} />}
      {post.image && (
        <div>
          <ImageStubView image={post.image} />
        </div>
      )}
      {post.gallery && (
        <div>
          Not Implemented
          {/* <GalleryStubView gallery={post.gallery} /> */}
        </div>
      )}
      {post.book && (
        <div>
          <BookStubView book={post.book} size="sm" showFooter={false} />
        </div>
      )}
      {post.character && (
        <div>
          Not Implemented
          {/* <CharacterStubView character={post.character} /> */}
        </div>
      )}

      {comments && comments.length > 0 && (
        <div className="mt-4 text-sm font-semibold">⤵ Replies</div>
      )}
      <JsonBlock data={post} />
    </div>
  ) : (
    <></>
  )
}

export default PostStubView
