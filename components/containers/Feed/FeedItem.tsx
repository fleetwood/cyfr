import { PostStub } from "prisma/types"
import PostStubView from "../Post/PostStubView"
import FeedFooter from "./FeedFooter"
import FeedHeader from "./FeedHeader"
import ShareHeader from "../Share/ShareHeader"
import PostHeader from "../Post/PostHeader"
import ShareFooter from "../Share/ShareFooter"
import PostFooter from "../Post/PostFooter"

type FeedItemProps = {
  item: PostStub
}

const FeedItem = ({ item }: FeedItemProps) => {
  const isShared = item.share
  return (
    <div
      className={`mt-4 p-4 rounded-2xl snap-always snap-start border-2
      ${isShared ? `border-primary` : `border-neutral`}`}
      >
      {isShared 
      ? <ShareHeader share={item.share!} />
      : <PostHeader post={item} />
      }
      <div className="p-4 mt-4 font-feed">
        <PostStubView post={item} />
      </div>

      {isShared 
      ? <ShareFooter share={item.share!} />
      : <PostFooter post={item} />
      }
    </div>
  )
}

export default FeedItem
