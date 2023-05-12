import { MainFeed } from "../../../prisma/prismaContext"

import useDebug from "../../../hooks/useDebug"
import PostFooter from "../Post/PostFooter"
import GalleryFooter from "../Gallery/GalleryFooter"
import BookFooter from "../Books/BookFooter"
import CharacterFooter from "../Characters/CharacterFooter"
const { debug } = useDebug("PostItemFooter")

type FeedFooterProps = {
  item: MainFeed
}
const FeedFooter = ({ item }: FeedFooterProps) => {
  const {post, gallery, image, book, character} = item

  return (
    <>
      {post && <PostFooter post={post} />}
      {gallery && <GalleryFooter gallery={gallery} />}
      {book && <BookFooter book={book} />}
      {character && <CharacterFooter character={character} />}
    </>
)}

export default FeedFooter
