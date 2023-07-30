import { GalleryStub, MainFeed, PostStub } from "prisma/prismaContext"

import useDebug from "hooks/useDebug"
import PostFooter from "../Post/PostFooter"
import GalleryFooter from "../Gallery/GalleryFooter"
import BookFooter from "../Books/BookFooter"
import CharacterFooter from "../Characters/CharacterFooter"
import useFeed, { FeedTypes } from "hooks/useFeed"
import ImageFooter from "../Image/ImageFooter"
import ShareFooter from "../Share/ShareFooter"
const { debug } = useDebug("PostItemFooter")

type FeedFooterProps = {
  item: PostStub
}
const FeedFooter = ({ item }: FeedFooterProps) => {
  const {share } = item

  const {invalidate} = useFeed('post')
  const onInvalidate = () => {
    debug('invalidate')
    invalidate()
  }
  
  return (
    <>
      {share 
        ? <ShareFooter share={item.share!} /> 
        : <PostFooter post={(item)} onUpdate={onInvalidate} />
      }
    </>
)}

export default FeedFooter
