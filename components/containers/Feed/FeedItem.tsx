import React from "react";
import { MainFeed } from "../../../prisma/types";
import FeedHeader from "./FeedHeader";
import Link from "next/link";
import { timeDifference } from "../../../utils/helpers";
import Avatar from "../../ui/avatar";
import BookFeedView from "../Books/BookFeedView";
import CharacterFeedView from "../Characters/CharacterFeedView";
import GalleryDetailView from "../Gallery/GalleryDetailView";
import ImageStubView from "../Image/ImageStubView";
import PostStubView from "../Post/PostStubView";
import FeedFooter from "./FeedFooter";
import GalleryStubView from "../Gallery/GalleryStubView";

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
            {item.book && <BookFeedView item={item} />}
            {item.character && <CharacterFeedView item={item} />}
        </div>
        <FeedFooter item={item} />
    </div>
  );
};

export default FeedItem;
