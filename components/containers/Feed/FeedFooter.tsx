import { MainFeed } from "../../../prisma/prismaContext"

import useDebug from "../../../hooks/useDebug"
import PostFooter from "../Post/PostFooter"
import GalleryFooter from "../Gallery/GalleryFooter"
import BookFooter from "../Books/BookFooter"
import CharacterFooter from "../Characters/CharacterFooter"
import useFeed, { FeedTypes } from "../../../hooks/useFeed"
const { debug } = useDebug("PostItemFooter")

type FeedFooterProps = {
  item: MainFeed
}
const FeedFooter = ({ item }: FeedFooterProps) => {
  const {post, gallery, image, book, character} = item

  const { invalidateFeed } = useFeed('main')
  const onInvalidate = () => {
    debug('invalidateFeed')
    invalidateFeed('main')
  }
  
  return (
    <>
      {post && <PostFooter post={post} onUpdate={onInvalidate} />}
      {gallery && <GalleryFooter gallery={gallery} onUpdate={onInvalidate} />}
      {book && <BookFooter bookDetail={book} onUpdate={onInvalidate} />}
      {character && <CharacterFooter character={character} onUpdate={onInvalidate} />}
    </>
)}

export default FeedFooter
