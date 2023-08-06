import { PostStub } from "prisma/types"
import PostStubView from "../Post/PostStubView"
import ShareHeader from "../Share/ShareHeader"
import PostHeader from "../Post/PostHeader"
import ShareFooter from "../Share/ShareFooter"
import PostFooter from "../Post/PostFooter"
import JsonBlock from "components/ui/jsonBlock"
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
