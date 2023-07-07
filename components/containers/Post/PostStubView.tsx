import { BookStub, GalleryStub, ImageStub, PostStub } from 'prisma/prismaContext'

import JsonBlock from 'components/ui/jsonBlock'
import HtmlContent from 'components/ui/htmlContent'
import GalleryPhotoswipe from '../Gallery/GalleryPhotoswipe'
import useDebug from 'hooks/useDebug'
import ImageStubView from '../Image/ImageStubView'
import BookStubView from '../Books/BookStubView'
import GalleryStubView from '../Gallery/GalleryStubView'

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
        <ImageStubView image={post.image as unknown as ImageStub} />
      )}
      {post.gallery && (
        <GalleryStubView gallery={post.gallery as GalleryStub} />
      )}
      {post.book && (
        <div>
          <BookStubView book={post.book as unknown as BookStub} size="sm" showFooter={false} />
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
