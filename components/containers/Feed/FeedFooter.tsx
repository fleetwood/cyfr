import { GalleryStub, MainFeed, PostStub } from "prisma/prismaContext"

import useDebug from "hooks/useDebug"
import PostFooter from "../Post/PostFooter"
import GalleryFooter from "../Gallery/GalleryFooter"
import BookFooter from "../Books/BookFooter"
import CharacterFooter from "../Characters/CharacterFooter"
import useFeed, { FeedTypes } from "hooks/useFeed"
import ImageFooter from "../Image/ImageFooter"
const { debug } = useDebug("PostItemFooter")

type FeedFooterProps = {
  item: PostStub
}
const FeedFooter = ({ item }: FeedFooterProps) => {
  const {post, gallery, image, book, character} = item

  const {invalidate} = useFeed('post')
  const onInvalidate = () => {
    debug('invalidate')
    invalidate()
  }
  
  return (
    <>
      {
        gallery ? <GalleryFooter gallery={gallery as GalleryStub} onUpdate={onInvalidate} /> :
        image || book ? <></> :
        // character ? <CharacterFooter character={character} onUpdate={onInvalidate} /> :
        <PostFooter post={(item.post ?? item)} onUpdate={onInvalidate} />
      }
    </>
)}

export default FeedFooter
