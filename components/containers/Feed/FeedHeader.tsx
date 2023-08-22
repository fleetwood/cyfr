import { PostStub } from "prisma/prismaContext"
import PostHeader from "../Post/PostHeader"
import ShareHeader from "../Share/ShareHeader"

type FeedHeaderProps = {
  item:       PostStub
  isShared?:  boolean
}

const FeedHeader = ({ item, isShared }: FeedHeaderProps) => {
  return (isShared 
    ? <ShareHeader share={item.share!} />
    : <PostHeader post={item} />
  )
}
export default FeedHeader
