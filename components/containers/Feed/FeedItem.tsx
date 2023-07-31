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
      className={`mt-4 p-4 rounded-2xl snap-always snap-start border-2
      ${isShared ? `border-primary` : `border-neutral`}`}
      >
      <ShareHeader share={post.share!} />
      <div className="p-4 mt-4 font-feed">
        <h3>Creator: {post.creatorId}</h3>
        <h3>Post: {post.id}</h3>
        <SharedStubView share={post.share!} />
      </div>
      <ShareFooter share={post.share!} />
    </div>
    : 
    <div
      className={`mt-4 p-4 rounded-2xl snap-always snap-start border-2
      ${isShared ? `border-primary` : `border-neutral`}`}
      >
      <PostHeader post={post} />
      <div className="p-4 mt-4 font-feed">
        <h3>Creator: {post.creatorId}</h3>
        <h3>Post: {post.id}</h3>
        <PostStubView post={post} />
      </div>
      <PostFooter post={post} />
    </div>
}

export default FeedPost
