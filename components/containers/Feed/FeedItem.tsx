import React from "react";
import { MainFeed } from "../../../prisma/types";
import FeedHeader from "./FeedHeader";
import Link from "next/link";
import { timeDifference } from "../../../utils/helpers";
import Avatar from "../../ui/avatar";
import BookFeedView from "../Books/BookFeedView";
import CharacterFeedView from "../Characters/CharacterFeedView";
import GalleryFeedView from "../Gallery/GalleryDetailView";
import ImageFeedView from "../Image/ImageFeedView";
import PostFeedView from "../Post/PostFeedView";
import FeedFooter from "./FeedFooter";

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
            {item.post && <PostFeedView item={item} />}
            {item.image && <ImageFeedView item={item} />}
            {item.gallery && <GalleryFeedView item={item} />}
            {item.book && <BookFeedView item={item} />}
            {item.character && <CharacterFeedView item={item} />}
        </div>
        <FeedFooter item={item} />
    </div>
  );
};

export default FeedItem;
