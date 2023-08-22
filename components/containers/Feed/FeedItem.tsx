import {PostStub} from "prisma/types"
import PostFooter from "../Post/PostFooter"
import PostHeader from "../Post/PostHeader"
import PostStubView from "../Post/PostStubView"
import ShareFooter from "../Share/ShareFooter"
import ShareHeader from "../Share/ShareHeader"
import SharedStubView from "../Share/ShareStubView"

type FeedPostProps = {
  post: PostStub
}

const FeedPost = ({ post }: FeedPostProps) => {
  const isShared = post.share
  return isShared ?
    <div
      className='mt-8 snap-always snap-start bg-base-200 bg-opacity-50 shadow-md shadow-black'
      >
      <ShareHeader share={post.share!} />
      <SharedStubView share={post.share!} />
      <ShareFooter share={post.share!} />
    </div>
    : 
    <div
      className='mt-8 snap-always snap-start bg-base-200 shadow-md shadow-black'
      >
      <PostHeader post={post} />
      <PostStubView post={post} />
      <PostFooter post={post} />
    </div>
}

export default FeedPost
