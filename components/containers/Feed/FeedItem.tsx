import { MainFeed } from "../../../prisma/types";
import BookStubView from "../Books/BookStubView";
import CharacterStubView from "../Characters/CharacterStubView";
import GalleryStubView from "../Gallery/GalleryStubView";
import ImageStubView from "../Image/ImageStubView";
import PostStubView from "../Post/PostStubView";
import FeedFooter from "./FeedFooter";
import FeedHeader from "./FeedHeader";

type FeedItemProps = {
  item: MainFeed;
};

const FeedItem = ({ item }: FeedItemProps) => {
  const { isShare, author } = item;

  return (
    <div
      className={`
      mt-4 p-4 
      rounded-2xl
      snap-always snap-start
      border-2
      ${isShare ? `border-primary` : `border-neutral`}`}
    >
        <FeedHeader item={item} />
        <div className="p-4 mt-4 font-feed">
          {item.post && <PostStubView post={item.post} />}
          {item.image && <ImageStubView image={item.image} />}
          {item.gallery && <GalleryStubView gallery={item.gallery} />}
          {item.book && <BookStubView book={item.book} size="sm" showFooter={false} />}
          {item.character && <CharacterStubView character={item.character} />}
        </div>
        <FeedFooter item={item} />
    </div>
  );
};

export default FeedItem;
