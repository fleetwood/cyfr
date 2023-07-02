import { isShare } from "utils/helpers";
import { MainFeed, PostStub } from "../../../prisma/types";
import BookStubView from "../Books/BookStubView";
import CharacterStubView from "../Characters/CharacterStubView";
import GalleryStubView from "../Gallery/GalleryStubView";
import ImageStubView from "../Image/ImageStubView";
import PostStubView from "../Post/PostStubView";
import FeedFooter from "./FeedFooter";
import FeedHeader from "./FeedHeader";

type FeedItemProps = {
  item: PostStub;
};

const FeedItem = ({ item }: FeedItemProps) => {
  const isShared = isShare(item)
  return (
    <div
      className={`
      mt-4 p-4 
      rounded-2xl
      snap-always snap-start
      border-2
      ${isShared ? `border-primary` : `border-neutral`}`}
    >
        <FeedHeader item={item} />
        <div className="p-4 mt-4 font-feed">
          <PostStubView post={item} />
        </div>
        <FeedFooter item={item} />
    </div>
  );
};

export default FeedItem;
