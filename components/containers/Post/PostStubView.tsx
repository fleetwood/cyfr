import { BookStub, CharacterStub, GalleryStub, ImageStub, PostStub } from 'prisma/prismaContext'

import HtmlContent from 'components/ui/htmlContent'
import useDebug from 'hooks/useDebug'
import BookStubView from '../Books/BookStubView'
import CharacterStubView from '../Characters/CharacterStubView'
import PostCommentThread from '../Comment/PostCommentThread'
import GalleryPhotoswipe from '../Gallery/GalleryPhotoswipe'
import GalleryStubView from '../Gallery/GalleryStubView'
import ImageStubView from '../Image/ImageStubView'
import SharedPostStubView from './SharedPostStubView'

const { debug, jsonBlock } = useDebug('PostStubView','DEBUG')

type PostFeedItemProps = {
  post: PostStub
}

const PostStubView = ({ post }: PostFeedItemProps) => {
  const comments: any[] = []

  return post ? (
    <div>
      {post.content && <HtmlContent content={post.content} className="font-feed" />}

      {post.images[0] && <GalleryPhotoswipe images={post.images} />}

      {post.post && <SharedPostStubView post={post.post} />}

      {post.image && <ImageStubView image={post.image as ImageStub} />}

      {post.gallery && <GalleryStubView gallery={post.gallery as GalleryStub} />}

      {post.book && <BookStubView book={post.book as unknown as BookStub} size="sm" showFooter={false} />}

      {post.character && <CharacterStubView characterStub={post.character as unknown as CharacterStub} />}

      {post.commentThread && <PostCommentThread postStub={post} /> }

      {/* {jsonBlock(post.post)} */}
    </div>
  ) : (
    <></>
  )
}

export default PostStubView
