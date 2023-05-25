import { PostStub } from "../../../prisma/prismaContext"

import useDebug from "../../../hooks/useDebug"
import HtmlContent from "../../ui/htmlContent"
import GalleryPhotoswipe from "../Gallery/GalleryPhotoswipe"
const { debug, jsonBlock } = useDebug("MainFeedItem")

type PostFeedItemProps = {
  post: PostStub
}

const PostStubView = ({ post }: PostFeedItemProps) => {
  const comments: any[] = []

  return post ? (
    <div>
      {post.content && <HtmlContent content={post.content} className="font-feed" />}

      {post.images?.length > 0 && post.images[0] !== null && (
        <GalleryPhotoswipe images={post.images} />
      )}

      {comments && comments.length > 0 && (
        <div className="mt-4 text-sm font-semibold">⤵ Replies</div>
      )}
    </div>
  ) : (
    <></>
  )
}

export default PostStubView
